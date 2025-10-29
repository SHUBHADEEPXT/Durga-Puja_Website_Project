# EKS Cluster Access and kubectl Connection Issues

**Issue ID**: EKS-001  
**Date**: October 8, 2024  
**Severity**: HIGH  
**Status**: ✅ RESOLVED

---

## Problem Description

Cannot access EKS cluster with kubectl after infrastructure deployment:

```
Error: Unable to connect to the server: dial tcp 127.0.0.1:32859: connect: connection refused
Error: The connection to the server localhost:8080 was refused
Error: error: You must be logged in to the server (Unauthorized)
```

**Screenshot Evidence**: 
- #62: kubectl connection refused to localhost:32859
- #75: Successful aws eks update-kubeconfig command
- #76: kubectl get nodes showing 5 ready nodes
- #77: kubectl cluster-info showing successful connection
- #78: Detailed node information with IPs
- #79: All Kubernetes resources listed

---

## Root Cause Analysis

### Issue 1: Kubeconfig Not Configured

After EKS cluster creation, kubectl doesn't automatically know how to connect. The kubeconfig file (`~/.kube/config`) needs to be updated with cluster credentials.

### Issue 2: Wrong Context Selected

Multiple Kubernetes clusters configured in kubeconfig, but wrong context is active.

### Issue 3: IAM Authentication Failed

AWS IAM authentication token expired or user doesn't have proper permissions.

---

## Solution

### Step 1: Update Kubeconfig

```bash
# Get cluster name from Terraform output
cd infrastructure/terraform
terraform output eks_cluster_name
# Output: durga-puja-eks

# Update kubeconfig with cluster credentials
aws eks update-kubeconfig \
  --region us-east-1 \
  --name durga-puja-eks

# Expected output:
# Added new context arn:aws:eks:us-east-1:ACCOUNT_ID:cluster/durga-puja-eks to /home/user/.kube/config
```

**Verification from Screenshot #75:**
✅ Command executed successfully
✅ Context added to kubeconfig

### Step 2: Verify Connection

```bash
# Check cluster info
kubectl cluster-info

# Expected output (Screenshot #77):
# Kubernetes control plane is running at https://780B7H1F5CB1A90B782EBC3F7A61B24B.gr7.us-east-1.eks.amazonaws.com
# CoreDNS is running at https://...

# Get nodes
kubectl get nodes

# Expected output (Screenshot #76):
# NAME                         STATUS   ROLES    AGE   VERSION
# ip-10-0-10-132.ec2.internal  Ready    <none>   50m   v1.28.15-eks-113cf36
# ip-10-0-10-248.ec2.internal  Ready    <none>   50m   v1.28.15-eks-113cf36
# ip-10-0-11-182.ec2.internal  Ready    <none>   50m   v1.28.15-eks-113cf36
# ip-10-0-12-167.ec2.internal  Ready    <none>   49m   v1.28.15-eks-113cf36
# ip-10-0-12-219.ec2.internal  Ready    <none>   50m   v1.28.15-eks-113cf36
```

### Step 3: Check Context

```bash
# List all contexts
kubectl config get-contexts

# Switch context if needed
kubectl config use-context arn:aws:eks:us-east-1:ACCOUNT_ID:cluster/durga-puja-eks

# Verify current context
kubectl config current-context
```

---

## Advanced Troubleshooting

### Issue: Unauthorized Error

```bash
# Check AWS credentials
aws sts get-caller-identity

# Output should show your AWS account ID
# If it fails, configure AWS CLI:
aws configure
```

### Issue: Token Expired

```bash
# Remove old kubeconfig entry
kubectl config unset users.arn:aws:eks:us-east-1:ACCOUNT_ID:cluster/durga-puja-eks

# Re-add with fresh token
aws eks update-kubeconfig --region us-east-1 --name durga-puja-eks
```

### Issue: Permission Denied

```bash
# Check IAM user/role permissions
aws eks describe-cluster --name durga-puja-eks

# If access denied, attach EKS policy:
aws iam attach-user-policy \
  --user-name your-username \
  --policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy
```

---

## Verification Checklist

- [ ] AWS CLI configured with correct region
- [ ] EKS cluster is in "Active" state
- [ ] IAM user has EKS permissions
- [ ] Kubeconfig updated successfully
- [ ] kubectl cluster-info works
- [ ] kubectl get nodes shows all nodes Ready
- [ ] Can list pods: kubectl get pods -A

---

## Best Practices

✅ Update kubeconfig immediately after cluster creation
✅ Use specific cluster names (avoid typos)
✅ Verify AWS credentials before kubectl commands
✅ Set proper IAM permissions for EKS access
✅ Use context names for multiple clusters

---

## Related Issues

- [Terraform State Lock](08-terraform-state-lock.md)
- [VPC Configuration](10-vpc-configuration.md)

---

**Last Updated**: October 29, 2025  
**Screenshot References**: #62, #75, #76, #77, #78, #79# EKS Cluster Access and kubectl Connection Issues

**Issue ID**: EKS-001  
**Date**: October 8, 2025  
**Severity**: HIGH  
**Status**: ✅ RESOLVED

---

## Problem Description

Cannot access EKS cluster with kubectl after infrastructure deployment:

```
Error: Unable to connect to the server: dial tcp 127.0.0.1:32859: connect: connection refused
Error: The connection to the server localhost:8080 was refused
Error: error: You must be logged in to the server (Unauthorized)
```

**Screenshot Evidence**: 
- #62: kubectl connection refused to localhost:32859
- #75: Successful aws eks update-kubeconfig command
- #76: kubectl get nodes showing 5 ready nodes
- #77: kubectl cluster-info showing successful connection
- #78: Detailed node information with IPs
- #79: All Kubernetes resources listed

---

## Root Cause Analysis

### Issue 1: Kubeconfig Not Configured

After EKS cluster creation, kubectl doesn't automatically know how to connect. The kubeconfig file (`~/.kube/config`) needs to be updated with cluster credentials.

### Issue 2: Wrong Context Selected

Multiple Kubernetes clusters configured in kubeconfig, but wrong context is active.

### Issue 3: IAM Authentication Failed

AWS IAM authentication token expired or user doesn't have proper permissions.

---

## Solution

### Step 1: Update Kubeconfig

```bash
# Get cluster name from Terraform output
cd infrastructure/terraform
terraform output eks_cluster_name
# Output: durga-puja-eks

# Update kubeconfig with cluster credentials
aws eks update-kubeconfig \
  --region us-east-1 \
  --name durga-puja-eks

# Expected output:
# Added new context arn:aws:eks:us-east-1:ACCOUNT_ID:cluster/durga-puja-eks to /home/user/.kube/config
```

**Verification from Screenshot #75:**
✅ Command executed successfully
✅ Context added to kubeconfig

### Step 2: Verify Connection

```bash
# Check cluster info
kubectl cluster-info

# Expected output (Screenshot #77):
# Kubernetes control plane is running at https://780B7H1F5CB1A90B782EBC3F7A61B24B.gr7.us-east-1.eks.amazonaws.com
# CoreDNS is running at https://...

# Get nodes
kubectl get nodes

# Expected output (Screenshot #76):
# NAME                         STATUS   ROLES    AGE   VERSION
# ip-10-0-10-132.ec2.internal  Ready    <none>   50m   v1.28.15-eks-113cf36
# ip-10-0-10-248.ec2.internal  Ready    <none>   50m   v1.28.15-eks-113cf36
# ip-10-0-11-182.ec2.internal  Ready    <none>   50m   v1.28.15-eks-113cf36
# ip-10-0-12-167.ec2.internal  Ready    <none>   49m   v1.28.15-eks-113cf36
# ip-10-0-12-219.ec2.internal  Ready    <none>   50m   v1.28.15-eks-113cf36
```

### Step 3: Check Context

```bash
# List all contexts
kubectl config get-contexts

# Switch context if needed
kubectl config use-context arn:aws:eks:us-east-1:ACCOUNT_ID:cluster/durga-puja-eks

# Verify current context
kubectl config current-context
```

---

## Advanced Troubleshooting

### Issue: Unauthorized Error

```bash
# Check AWS credentials
aws sts get-caller-identity

# Output should show your AWS account ID
# If it fails, configure AWS CLI:
aws configure
```

### Issue: Token Expired

```bash
# Remove old kubeconfig entry
kubectl config unset users.arn:aws:eks:us-east-1:ACCOUNT_ID:cluster/durga-puja-eks

# Re-add with fresh token
aws eks update-kubeconfig --region us-east-1 --name durga-puja-eks
```

### Issue: Permission Denied

```bash
# Check IAM user/role permissions
aws eks describe-cluster --name durga-puja-eks

# If access denied, attach EKS policy:
aws iam attach-user-policy \
  --user-name your-username \
  --policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy
```

---

## Verification Checklist

- [ ] AWS CLI configured with correct region
- [ ] EKS cluster is in "Active" state
- [ ] IAM user has EKS permissions
- [ ] Kubeconfig updated successfully
- [ ] kubectl cluster-info works
- [ ] kubectl get nodes shows all nodes Ready
- [ ] Can list pods: kubectl get pods -A

---

## Best Practices

✅ Update kubeconfig immediately after cluster creation
✅ Use specific cluster names (avoid typos)
✅ Verify AWS credentials before kubectl commands
✅ Set proper IAM permissions for EKS access
✅ Use context names for multiple clusters

---

## Related Issues

- [Terraform State Lock](08-terraform-state-lock.md)
- [VPC Configuration](10-vpc-configuration.md)

---

**Last Updated**: October 29, 2025  
**Screenshot References**: #62, #75, #76, #77, #78, #79
