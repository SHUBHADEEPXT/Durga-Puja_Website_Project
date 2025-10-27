# Terraform Destroy Blocked by Dependencies

**Issue ID**: TERRAFORM-002  
**Date**: October 7, 2024  
**Severity**: HIGH  
**Status**: ✅ RESOLVED

---

## Problem Description

When attempting to destroy infrastructure with `terraform destroy`, the operation fails or hangs due to dependent resources not tracked by Terraform:

```
Error: error deleting VPC: DependencyViolation: 
The vpc 'vpc-xxxxx' has dependencies and cannot be deleted

Error: error deleting Internet Gateway: DependencyViolation: 
Network interface is still attached

Error: error deleting Security Group: DependencyViolation: 
resource has a dependent object
```

**Screenshot Evidence**: 
- #66: Terraform destroy in progress, acquiring state lock
- #67: Terraform destroy command execution

---

## Root Cause Analysis

### Why Terraform Destroy Gets Blocked

1. **Kubernetes-Created Resources**: Load Balancers, ENIs, and Security Groups created by Kubernetes controllers are not in Terraform state
2. **Resource Dependencies**: AWS resources have implicit dependencies that prevent deletion
3. **Active Connections**: RDS, ElastiCache, or NAT Gateways with active connections
4. **Cross-Stack References**: Resources referenced by other CloudFormation stacks or Terraform workspaces

### Common Blockers

| Resource | Created By | In Terraform State? | Blocks Deletion Of |
|----------|------------|---------------------|-------------------|
| Application Load Balancer | AWS Load Balancer Controller | ❌ No | VPC, Subnets, Security Groups |
| Elastic Network Interfaces | EKS, RDS, ElastiCache | ❌ No | Subnets, Security Groups |
| Security Group Rules | K8s Services | ❌ No | Security Groups, VPC |
| Route53 Records | External-DNS | ❌ No | Load Balancers |

---

## Solution

### Pre-Destroy Cleanup Checklist

#### Step 1: Delete Kubernetes Resources First

```bash
# CRITICAL: Delete all K8s resources that create AWS resources

# 1. Delete all services of type LoadBalancer
kubectl delete svc --all -n durga-puja
kubectl delete svc --all -n kube-system

# Wait for Load Balancers to be deleted (2-3 minutes)
echo "Waiting for Load Balancers to be deleted..."
sleep 180

# 2. Delete all ingress resources
kubectl delete ingress --all -n durga-puja

# Wait for ALBs to be deleted (2-3 minutes)
sleep 180

# 3. Delete entire namespace (this cascades to all resources)
kubectl delete namespace durga-puja
kubectl delete namespace argocd
kubectl delete namespace monitoring

# 4. Wait for all pods to terminate
kubectl get pods --all-namespaces

# 5. Delete any remaining persistent volume claims
kubectl delete pvc --all --all-namespaces
```

#### Step 2: Manually Delete AWS Load Balancers

```bash
# Find all Load Balancers in your VPC
VPC_ID=$(terraform output -raw vpc_id)

# List all Application Load Balancers
echo "Finding ALBs..."
aws elbv2 describe-load-balancers \
  --query "LoadBalancers[?VpcId=='$VPC_ID'].{Name:LoadBalancerName,ARN:LoadBalancerArn}" \
  --output table

# Delete each ALB
for lb_arn in $(aws elbv2 describe-load-balancers \
  --query "LoadBalancers[?VpcId=='$VPC_ID'].LoadBalancerArn" \
  --output text); do
  echo "Deleting Load Balancer: $lb_arn"
  aws elbv2 delete-load-balancer --load-balancer-arn "$lb_arn"
done

# Wait for ALBs to finish deleting (2-3 minutes)
sleep 180

# List all Classic Load Balancers
echo "Finding Classic ELBs..."
aws elb describe-load-balancers \
  --query "LoadBalancerDescriptions[?VPCId=='$VPC_ID'].LoadBalancerName" \
  --output table

# Delete Classic Load Balancers
for elb in $(aws elb describe-load-balancers \
  --query "LoadBalancerDescriptions[?VPCId=='$VPC_ID'].LoadBalancerName" \
  --output text); do
  echo "Deleting Classic ELB: $elb"
  aws elb delete-load-balancer --load-balancer-name "$elb"
done

# Wait for deletion
sleep 60
```

#### Step 3: Delete Target Groups

```bash
# List target groups in VPC
echo "Finding Target Groups..."
aws elbv2 describe-target-groups \
  --query "TargetGroups[?VpcId=='$VPC_ID'].{Name:TargetGroupName,ARN:TargetGroupArn}" \
  --output table

# Delete each target group
for tg_arn in $(aws elbv2 describe-target-groups \
  --query "TargetGroups[?VpcId=='$VPC_ID'].TargetGroupArn" \
  --output text); do
  echo "Deleting Target Group: $tg_arn"
  aws elbv2 delete-target-group --target-group-arn "$tg_arn" || true
done

# Wait for deletion
sleep 30
```

#### Step 4: Delete Dangling ENIs (Elastic Network Interfaces)

```bash
# Find all ENIs in VPC
echo "Finding Elastic Network Interfaces..."
aws ec2 describe-network-interfaces \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'NetworkInterfaces[*].{ID:NetworkInterfaceId,Status:Status,Description:Description}' \
  --output table

# Delete unattached ENIs
for eni in $(aws ec2 describe-network-interfaces \
  --filters "Name=vpc-id,Values=$VPC_ID" "Name=status,Values=available" \
  --query 'NetworkInterfaces[*].NetworkInterfaceId' \
  --output text); do
  echo "Deleting ENI: $eni"
  aws ec2 delete-network-interface --network-interface-id "$eni" || true
done

# Wait for deletion
sleep 30
```

#### Step 5: Check for Remaining Dependencies

```bash
# Check for EC2 instances
echo "Checking for EC2 instances..."
aws ec2 describe-instances \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'Reservations[*].Instances[*].{ID:InstanceId,State:State.Name}' \
  --output table

# Check for NAT Gateways (should be managed by Terraform)
echo "Checking for NAT Gateways..."
aws ec2 describe-nat-gateways \
  --filter "Name=vpc-id,Values=$VPC_ID" \
  --query 'NatGateways[*].{ID:NatGatewayId,State:State}' \
  --output table

# Check for VPN connections
echo "Checking for VPN connections..."
aws ec2 describe-vpn-connections \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'VpnConnections[*].{ID:VpnConnectionId,State:State}' \
  --output table
```

#### Step 6: Now Run Terraform Destroy

```bash
# Change to Terraform directory
cd infrastructure/terraform

# Run destroy
terraform destroy -auto-approve

# If it still fails, use targeted destroy in order
terraform destroy -target=aws_eks_cluster.main -auto-approve
terraform destroy -target=aws_db_instance.main -auto-approve
terraform destroy -target=aws_elasticache_replication_group.redis -auto-approve
terraform destroy -target=aws_nat_gateway.main -auto-approve
terraform destroy -auto-approve
```

---

## Automated Cleanup Script

Create this script for repeatable cleanup:

```bash
#!/bin/bash
# cleanup-before-destroy.sh

set -e

echo "========================================="
echo "AWS Infrastructure Cleanup Script"
echo "========================================="

# Get VPC ID from Terraform
VPC_ID=$(cd infrastructure/terraform && terraform output -raw vpc_id)
echo "VPC ID: $VPC_ID"

# Function to wait with progress
wait_with_progress() {
  local seconds=$1
  local message=$2
  echo -n "$message"
  for ((i=1; i<=seconds; i++)); do
    sleep 1
    echo -n "."
  done
  echo " Done!"
}

# 1. Delete Kubernetes Resources
echo -e "\n[1/7] Deleting Kubernetes resources..."
kubectl delete namespace durga-puja --ignore-not-found=true &
kubectl delete namespace argocd --ignore-not-found=true &
kubectl delete namespace monitoring --ignore-not-found=true &
wait
wait_with_progress 120 "Waiting for namespaces to terminate"

# 2. Delete Load Balancers
echo -e "\n[2/7] Deleting Application Load Balancers..."
ALB_ARNS=$(aws elbv2 describe-load-balancers \
  --query "LoadBalancers[?VpcId=='$VPC_ID'].LoadBalancerArn" \
  --output text)

if [ ! -z "$ALB_ARNS" ]; then
  for arn in $ALB_ARNS; do
    echo "  Deleting ALB: $(basename $arn)"
    aws elbv2 delete-load-balancer --load-balancer-arn "$arn" || true
  done
  wait_with_progress 180 "Waiting for ALBs to delete"
else
  echo "  No ALBs found"
fi

# 3. Delete Classic Load Balancers
echo -e "\n[3/7] Deleting Classic Load Balancers..."
CLB_NAMES=$(aws elb describe-load-balancers \
  --query "LoadBalancerDescriptions[?VPCId=='$VPC_ID'].LoadBalancerName" \
  --output text)

if [ ! -z "$CLB_NAMES" ]; then
  for name in $CLB_NAMES; do
    echo "  Deleting CLB: $name"
    aws elb delete-load-balancer --load-balancer-name "$name" || true
  done
  wait_with_progress 60 "Waiting for CLBs to delete"
else
  echo "  No Classic ELBs found"
fi

# 4. Delete Target Groups
echo -e "\n[4/7] Deleting Target Groups..."
TG_ARNS=$(aws elbv2 describe-target-groups \
  --query "TargetGroups[?VpcId=='$VPC_ID'].TargetGroupArn" \
  --output text)

if [ ! -z "$TG_ARNS" ]; then
  for arn in $TG_ARNS; do
    echo "  Deleting TG: $(basename $arn)"
    aws elbv2 delete-target-group --target-group-arn "$arn" || true
  done
  wait_with_progress 30 "Waiting for target groups to delete"
else
  echo "  No target groups found"
fi

# 5. Delete Unattached ENIs
echo -e "\n[5/7] Deleting unattached Network Interfaces..."
ENI_IDS=$(aws ec2 describe-network-interfaces \
  --filters "Name=vpc-id,Values=$VPC_ID" "Name=status,Values=available" \
  --query 'NetworkInterfaces[*].NetworkInterfaceId' \
  --output text)

if [ ! -z "$ENI_IDS" ]; then
  for eni in $ENI_IDS; do
    echo "  Deleting ENI: $eni"
    aws ec2 delete-network-interface --network-interface-id "$eni" || true
  done
  wait_with_progress 30 "Waiting for ENIs to delete"
else
  echo "  No unattached ENIs found"
fi

# 6. Summary of remaining resources
echo -e "\n[6/7] Checking for remaining dependencies..."
INSTANCES=$(aws ec2 describe-instances \
  --filters "Name=vpc-id,Values=$VPC_ID" "Name=instance-state-name,Values=running" \
  --query 'Reservations[*].Instances[*].InstanceId' \
  --output text | wc -w)
echo "  EC2 Instances: $INSTANCES"

NAT_GWS=$(aws ec2 describe-nat-gateways \
  --filter "Name=vpc-id,Values=$VPC_ID" "Name=state,Values=available" \
  --query 'NatGateways[*].NatGatewayId' \
  --output text | wc -w)
echo "  NAT Gateways: $NAT_GWS"

# 7. Ready for Terraform destroy
echo -e "\n[7/7] Cleanup complete!"
echo "========================================="
echo "You can now run: terraform destroy"
echo "========================================="
```

**Usage:**
```bash
# Make script executable
chmod +x cleanup-before-destroy.sh

# Run cleanup
./cleanup-before-destroy.sh

# Then destroy infrastructure
cd infrastructure/terraform
terraform destroy
```

---

## Prevention Strategies

### 1. Add Lifecycle Protection

```hcl
# Prevent accidental deletion of critical resources
resource "aws_db_instance" "main" {
  # ... other configuration ...
  
  deletion_protection = true  # Requires manual disable before destroy
  
  lifecycle {
    prevent_destroy = true  # Terraform will refuse to destroy
  }
}
```

### 2. Use Kubernetes Finalizers

```yaml
# Add finalizers to track AWS resources
apiVersion: v1
kind: Service
metadata:
  name: backend
  finalizers:
    - service.kubernetes.io/load-balancer-cleanup
spec:
  type: LoadBalancer
  # ...
```

### 3. Tag All Resources

```hcl
# Add consistent tags to track ownership
locals {
  common_tags = {
    Project     = "Durga-Puja-Platform"
    ManagedBy   = "Terraform"
    Environment = terraform.workspace
    Owner       = "DevOps"
  }
}

# Apply to all resources
resource "aws_vpc" "main" {
  # ...
  tags = merge(local.common_tags, {
    Name = "durga-puja-vpc"
  })
}
```

### 4. Create Destroy Order Module

```hcl
# modules/destroy-order/main.tf
resource "null_resource" "destroy_order" {
  triggers = {
    eks_cluster_name = var.eks_cluster_name
    vpc_id          = var.vpc_id
  }

  # This runs BEFORE destroy
  provisioner "local-exec" {
    when    = destroy
    command = <<EOF
      echo "Running pre-destroy cleanup..."
      kubectl delete namespace durga-puja --ignore-not-found=true
      sleep 120
      
      # Delete AWS resources not in Terraform state
      VPC_ID="${self.triggers.vpc_id}"
      
      # Delete ALBs
      for lb in $(aws elbv2 describe-load-balancers \
        --query "LoadBalancers[?VpcId=='$VPC_ID'].LoadBalancerArn" \
        --output text); do
        aws elbv2 delete-load-balancer --load-balancer-arn "$lb" || true
      done
      
      sleep 60
    EOF
  }
}
```

---

## Common Error Messages

### Error 1: VPC Has Dependencies

```
Error: error deleting VPC (vpc-xxxxx): DependencyViolation: 
The vpc 'vpc-xxxxx' has dependencies and cannot be deleted
```

**Diagnosis:**
```bash
# Find what's blocking VPC deletion
VPC_ID="vpc-xxxxx"

# Check for instances
aws ec2 describe-instances \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'Reservations[*].Instances[*].InstanceId'

# Check for load balancers
aws elbv2 describe-load-balancers \
  --query "LoadBalancers[?VpcId=='$VPC_ID'].LoadBalancerArn"

# Check for NAT gateways
aws ec2 describe-nat-gateways \
  --filter "Name=vpc-id,Values=$VPC_ID"

# Check for VPC endpoints
aws ec2 describe-vpc-endpoints \
  --filters "Name=vpc-id,Values=$VPC_ID"
```

### Error 2: Security Group Dependencies

```
Error: error deleting Security Group: DependencyViolation: 
resource sg-xxxxx has a dependent object
```

**Solution:**
```bash
# Find what's using the security group
SG_ID="sg-xxxxx"

aws ec2 describe-network-interfaces \
  --filters "Name=group-id,Values=$SG_ID" \
  --query 'NetworkInterfaces[*].{ID:NetworkInterfaceId,Description:Description}'

# Delete dependent ENIs
for eni in $(aws ec2 describe-network-interfaces \
  --filters "Name=group-id,Values=$SG_ID" \
  --query 'NetworkInterfaces[*].NetworkInterfaceId' \
  --output text); do
  aws ec2 delete-network-interface --network-interface-id "$eni"
done
```

### Error 3: Subnet Has Mapped Public IPs

```
Error: error deleting subnet: DependencyViolation: 
The subnet 'subnet-xxxxx' has dependencies and cannot be deleted
```

**Solution:**
```bash
# Find instances in subnet
SUBNET_ID="subnet-xxxxx"

aws ec2 describe-instances \
  --filters "Name=subnet-id,Values=$SUBNET_ID" \
  --query 'Reservations[*].Instances[*].{ID:InstanceId,State:State.Name}'

# Terminate instances if necessary
aws ec2 terminate-instances --instance-ids i-xxxxx
```

---

## Verification Checklist

Before running `terraform destroy`:

- [ ] All Kubernetes namespaces deleted
- [ ] All Load Balancers deleted (ALB and Classic)
- [ ] All Target Groups deleted
- [ ] All unattached ENIs deleted
- [ ] No running EC2 instances (except EKS nodes)
- [ ] NAT Gateways ready for deletion
- [ ] Waited adequate time (5+ minutes) after K8s cleanup
- [ ] VPC has no external dependencies

After `terraform destroy` completes:

- [ ] VPC deleted
- [ ] All subnets deleted
- [ ] All security groups deleted (except default)
- [ ] NAT Gateways deleted
- [ ] Elastic IPs released
- [ ] S3 bucket empty or deleted
- [ ] RDS instances deleted
- [ ] ElastiCache clusters deleted

---

## Best Practices Summary

✅ **DO**:
- Delete Kubernetes resources before Terraform
- Wait adequate time between deletions
- Use automation scripts for cleanup
- Tag all resources for tracking
- Implement lifecycle protection for critical resources

❌ **DON'T**:
- Run `terraform destroy` immediately after deployment
- Delete resources manually without updating state
- Ignore dependency errors
- Force delete without understanding impact
- Skip pre-destroy cleanup steps

---

## Related Issues

- [Terraform State Lock](08-terraform-state-lock.md) - State locking issues
- [AWS Resource Limits](09-aws-resource-limits.md) - Resource quota management
- [VPC Configuration Errors](10-vpc-configuration.md) - VPC dependency issues

---

**Last Updated**: October 23, 2024  
**Author**: Shubhadeep  
**Tested On**: Terraform v1.5.0, AWS Provider v5.0+  
**Screenshot References**: #66, #67
