# AWS Resource Limits and Quota Issues

**Issue ID**: AWS-001  
**Date**: October 7, 2024  
**Severity**: HIGH  
**Status**: ✅ RESOLVED

---

## Problem Description

Terraform apply fails with errors related to AWS service quotas:

```
Error: Error creating EKS Cluster: LimitExceededException: 
You have reached the maximum number of clusters allowed per account in this region

Error: Error creating VPC: VpcLimitExceeded: 
The maximum number of VPCs has been reached

Error: Error creating Elastic IP: AddressLimitExceeded: 
The maximum number of addresses has been reached
```

---

## Root Cause Analysis

### AWS Default Service Quotas

Every AWS account has default limits (soft limits) for resources:

| Resource | Default Limit | Typical Usage |
|----------|---------------|---------------|
| VPCs per Region | 5 | Our project: 1 |
| EKS Clusters per Region | 5-10 | Our project: 1 |
| Elastic IPs | 5 | Our project: 3 (NAT GWs) |
| NAT Gateways per AZ | 5 | Our project: 3 |
| EC2 Instances (t3.medium) | 20 | Our project: 5 |
| RDS Instances | 40 | Our project: 1 |
| ElastiCache Nodes | 100 | Our project: 2 |

### Why Limits Are Reached

1. **Multiple Test Environments**: Creating dev, staging, prod
2. **Failed Cleanup**: Resources not destroyed properly
3. **Concurrent Projects**: Other projects in same account
4. **Regional Restrictions**: Resources spread across regions

---

## Solution

### Step 1: Check Current Usage

```bash
# Install AWS CLI if not already
aws --version

# Check VPC usage
aws ec2 describe-vpcs --region us-east-1 \
  --query 'Vpcs[*].[VpcId,Tags[?Key==`Name`].Value|[0],State]' \
  --output table

# Check EKS clusters
aws eks list-clusters --region us-east-1

# Check Elastic IPs
aws ec2 describe-addresses --region us-east-1 \
  --query 'Addresses[*].[PublicIp,AllocationId,InstanceId,AssociationId]' \
  --output table

# Check NAT Gateways
aws ec2 describe-nat-gateways --region us-east-1 \
  --query 'NatGateways[*].[NatGatewayId,State,SubnetId,VpcId]' \
  --output table

# Check EC2 instances
aws ec2 describe-instances --region us-east-1 \
  --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,State.Name,Tags[?Key==`Name`].Value|[0]]' \
  --output table

# Check service quotas
aws service-quotas list-service-quotas \
  --service-code ec2 \
  --region us-east-1 \
  --query 'Quotas[?QuotaName==`VPCs per Region`]'
```

### Step 2: Identify Unused Resources

```bash
# Find VPCs without resources
for vpc in $(aws ec2 describe-vpcs --query 'Vpcs[*].VpcId' --output text); do
  echo "Checking VPC: $vpc"
  
  # Check for instances
  instances=$(aws ec2 describe-instances \
    --filters "Name=vpc-id,Values=$vpc" \
    --query 'Reservations[*].Instances[*].InstanceId' \
    --output text)
  
  if [ -z "$instances" ]; then
    echo "  ⚠️  VPC $vpc has no instances - can be deleted"
  fi
done

# Find unattached Elastic IPs
aws ec2 describe-addresses --region us-east-1 \
  --query 'Addresses[?AssociationId==null].[PublicIp,AllocationId]' \
  --output table
```

### Step 3: Clean Up Unused Resources

```bash
# Delete unused VPC (example)
VPC_ID="vpc-xxxxx"

# Delete all dependencies first
# 1. Delete NAT Gateways
aws ec2 describe-nat-gateways \
  --filter "Name=vpc-id,Values=$VPC_ID" \
  --query 'NatGateways[*].NatGatewayId' \
  --output text | \
  xargs -I {} aws ec2 delete-nat-gateway --nat-gateway-id {}

# 2. Release Elastic IPs
aws ec2 describe-addresses \
  --filters "Name=domain,Values=vpc" \
  --query 'Addresses[?AssociationId==null].AllocationId' \
  --output text | \
  xargs -I {} aws ec2 release-address --allocation-id {}

# 3. Delete Internet Gateway
IGW_ID=$(aws ec2 describe-internet-gateways \
  --filters "Name=attachment.vpc-id,Values=$VPC_ID" \
  --query 'InternetGateways[0].InternetGatewayId' \
  --output text)
aws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID
aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID

# 4. Delete Subnets
aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'Subnets[*].SubnetId' \
  --output text | \
  xargs -I {} aws ec2 delete-subnet --subnet-id {}

# 5. Delete VPC
aws ec2 delete-vpc --vpc-id $VPC_ID
```

### Step 4: Request Quota Increase

If you legitimately need more resources:

```bash
# Request quota increase via CLI
aws service-quotas request-service-quota-increase \
  --service-code ec2 \
  --quota-code L-F678F1CE \
  --desired-value 10 \
  --region us-east-1

# Or via AWS Console:
# 1. Go to Service Quotas console
# 2. Search for the service (EC2, EKS, etc.)
# 3. Find the quota (e.g., "VPCs per Region")
# 4. Click "Request quota increase"
# 5. Enter desired value and justification
# 6. Submit request (usually approved within 24-48 hours)
```

---

## Prevention Strategies

### 1. Use Terraform Workspaces

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "terraform-state-bucket"
    key            = "env/${terraform.workspace}/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
  }
}

# Use workspaces for environments
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod
```

### 2. Tag All Resources

```hcl
# variables.tf
variable "common_tags" {
  default = {
    Project     = "Durga-Puja-Platform"
    Environment = "prod"
    ManagedBy   = "Terraform"
    Owner       = "shubhadeep"
    CostCenter  = "DevOps"
  }
}

# Apply tags to all resources
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  
  tags = merge(
    var.common_tags,
    {
      Name = "durga-puja-vpc"
    }
  )
}
```

### 3. Implement Resource Lifecycle

```hcl
# Prevent accidental deletion
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  
  lifecycle {
    prevent_destroy = true  # Protect production resources
  }
}

# Auto-cleanup test resources
resource "aws_instance" "test" {
  ami           = "ami-xxxxx"
  instance_type = "t3.micro"
  
  tags = {
    Name = "test-instance"
    TTL  = "24h"  # Auto-delete after 24 hours
  }
}
```

### 4. Monitor Resource Usage

```bash
# Create CloudWatch dashboard
aws cloudwatch put-dashboard \
  --dashboard-name ResourceUsage \
  --dashboard-body file://dashboard.json

# dashboard.json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/Usage", "ResourceCount", {"stat": "Maximum"}]
        ],
        "period": 300,
        "stat": "Maximum",
        "region": "us-east-1",
        "title": "VPC Count"
      }
    }
  ]
}
```

### 5. Automated Cleanup Script

```bash
#!/bin/bash
# cleanup-unused-resources.sh

# Delete old EKS clusters (older than 7 days)
aws eks list-clusters --region us-east-1 --output text | \
while read cluster; do
  created=$(aws eks describe-cluster --name $cluster \
    --query 'cluster.createdAt' --output text)
  age_days=$(( ($(date +%s) - $(date -d "$created" +%s)) / 86400 ))
  
  if [ $age_days -gt 7 ]; then
    echo "Cluster $cluster is $age_days days old - consider deletion"
  fi
done

# Release unattached Elastic IPs
aws ec2 describe-addresses \
  --query 'Addresses[?AssociationId==null && Domain==`vpc`].AllocationId' \
  --output text | \
  xargs -I {} aws ec2 release-address --allocation-id {}

# Schedule with cron
# crontab -e
# 0 2 * * * /path/to/cleanup-unused-resources.sh >> /var/log/aws-cleanup.log 2>&1
```

---

## Common Quota Issues

### Issue 1: EKS Cluster Limit Reached

```
Error: LimitExceededException: You have reached the maximum 
number of clusters allowed per account
```

**Solution**:
```bash
# Check existing clusters
aws eks list-clusters --region us-east-1

# Delete unused cluster
aws eks delete-cluster --name old-cluster --region us-east-1

# Wait for deletion (takes 10-15 minutes)
aws eks describe-cluster --name old-cluster --region us-east-1
```

### Issue 2: Elastic IP Limit

```
Error: AddressLimitExceeded: The maximum number of addresses 
has been reached
```

**Solution**:
```bash
# Find unassociated IPs
aws ec2 describe-addresses \
  --query 'Addresses[?AssociationId==null]' \
  --output table

# Release unused IPs
aws ec2 release-address --allocation-id eipalloc-xxxxx
```

### Issue 3: VPC Limit

```
Error: VpcLimitExceeded: The maximum number of VPCs has been reached
```

**Solution**:
```bash
# List all VPCs
aws ec2 describe-vpcs --output table

# Check which VPCs have resources
for vpc in $(aws ec2 describe-vpcs --query 'Vpcs[*].VpcId' --output text); do
  count=$(aws ec2 describe-instances \
    --filters "Name=vpc-id,Values=$vpc" \
    --query 'length(Reservations[*].Instances[])' \
    --output text)
  echo "VPC $vpc has $count instances"
done

# Delete empty VPC
aws ec2 delete-vpc --vpc-id vpc-xxxxx
```

---

## Quota Increase Request Template

When requesting quota increase:

```
Subject: Request for Service Quota Increase - [Service Name]

Account ID: 123456789012
Region: us-east-1
Service: Amazon EC2
Quota Name: VPCs per Region
Current Limit: 5
Requested Limit: 10

Justification:
We are deploying a multi-environment Kubernetes platform with:
- Production environment (1 VPC)
- Staging environment (1 VPC)
- Development environments (3 VPCs)
- DR/Backup environment (1 VPC)
- Testing/QA environment (1 VPC)

Each environment requires complete network isolation for security 
and compliance purposes. We have automated cleanup processes in 
place to remove unused resources.

Business Impact:
This is blocking our production deployment scheduled for [Date].
Estimated monthly cost: $[Amount]

Thank you for your consideration.
```

---

## Verification Checklist

After resolving quota issues:

- [ ] Current usage below limits
- [ ] Unused resources cleaned up
- [ ] Quota increase requested (if needed)
- [ ] Monitoring alerts configured
- [ ] Tagging policy implemented
- [ ] Cleanup automation deployed
- [ ] Team notified of limits

---

## Best Practices Summary

✅ **DO**:
- Tag all resources consistently
- Clean up test environments regularly
- Monitor resource usage
- Request quota increases proactively
- Use workspaces for isolation
- Implement automated cleanup

❌ **DON'T**:
- Create resources in multiple regions unnecessarily
- Leave test environments running
- Ignore quota warnings
- Share AWS accounts without coordination
- Create resources without tags

---

## Related Issues

- [Terraform State Lock](08-terraform-state-lock.md)
- [VPC Configuration Errors](10-vpc-configuration.md)
- [EKS Cluster Access](16-eks-cluster-access.md)

---

**Last Updated**: October 23, 2024  
**Author**: Shubhadeep  
**Tested On**: AWS Account with default quotas
