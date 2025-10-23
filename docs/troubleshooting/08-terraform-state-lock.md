# Terraform State Lock Issues

**Issue ID**: TERRAFORM-001  
**Date**: October 7, 2024  
**Severity**: HIGH  
**Status**: ✅ RESOLVED

---

## Problem Description

When running Terraform commands, you encounter a state lock error preventing any infrastructure operations:

```
Error: Error acquiring the state lock

Error message: ConditionalCheckFailedException: The conditional request failed
Lock Info:
  ID:        abc123-def456-ghi789
  Path:      s3-bucket/terraform.tfstate
  Operation: OperationTypeApply
  Who:       user@hostname
  Version:   1.5.0
  Created:   2024-10-07 12:30:15
```

**Screenshot Evidence**: #66 - Terraform destroy acquiring state lock

---

## Root Cause Analysis

### Why State Locks Happen

1. **Previous Operation Interrupted**: Terraform command was killed before completion (Ctrl+C, network failure, system crash)
2. **Multiple Users**: Two users trying to run Terraform simultaneously
3. **CI/CD Pipeline**: Build was cancelled while Terraform was running
4. **Stale Lock**: Lock wasn't released properly due to unexpected termination

### How Terraform Locking Works

```
Normal Flow:
1. terraform apply/plan/destroy
2. Acquire lock in DynamoDB table
3. Perform operation
4. Release lock automatically

Failed Flow:
1. terraform apply
2. Acquire lock in DynamoDB
3. ❌ Process killed/interrupted
4. ❌ Lock NOT released (stale lock)
5. ❌ All future operations blocked
```

---

## Solution

### Step 1: Verify the Lock

First, confirm the lock exists and check who created it:

```bash
# Try to run any terraform command
terraform plan

# You'll see the lock information
# Check if it's your lock or someone else's
```

### Step 2: Force Unlock (If It's Your Lock)

```bash
# Get the Lock ID from the error message
# Example: abc123-def456-ghi789

# Force unlock using the Lock ID
terraform force-unlock abc123-def456-ghi789

# Confirm when prompted
# Type: yes
```

**Expected Output**:
```
Terraform will remove the lock on the remote state.
This will allow another run to take a lock on the remote state.
Do you want to continue?
  Enter a value: yes

Terraform state has been successfully unlocked!
```

### Step 3: Verify Lock Removal

```bash
# Try running a harmless command
terraform plan

# Should work without lock error
```

### Step 4: Resume Operations

```bash
# Now you can continue with your intended operation
terraform apply
# or
terraform destroy
```

---

## Advanced Solutions

### If Force Unlock Doesn't Work

#### Option 1: Manually Remove Lock from DynamoDB

```bash
# Find your DynamoDB lock table name
# Usually: terraform-state-lock-<environment>

# List locks
aws dynamodb scan \
  --table-name terraform-state-lock-prod \
  --region us-east-1

# Delete specific lock item
aws dynamodb delete-item \
  --table-name terraform-state-lock-prod \
  --key '{"LockID": {"S": "s3-bucket/terraform.tfstate-md5"}}' \
  --region us-east-1
```

#### Option 2: Wait for Automatic Timeout (If Configured)

Some organizations set lock timeouts. The lock may auto-expire after 30-60 minutes.

```bash
# Check every 5 minutes
watch -n 300 'terraform plan'
```

---

## Prevention Strategies

### 1. Always Let Terraform Complete

```bash
# ❌ DON'T DO THIS
terraform apply
# Ctrl+C during execution ← Creates stale lock

# ✅ DO THIS
terraform apply
# Wait for completion or use proper cancellation
```

### 2. Use Workspace Isolation

```bash
# Create separate workspaces for different users/environments
terraform workspace new dev-yourname
terraform workspace select dev-yourname
terraform apply
```

### 3. Implement CI/CD Best Practices

```yaml
# .github/workflows/terraform.yml
jobs:
  terraform:
    steps:
      # Add timeout to prevent infinite locks
      - name: Terraform Apply
        run: terraform apply -auto-approve
        timeout-minutes: 30  # Auto-cancel after 30 min
      
      # Always cleanup on failure
      - name: Cleanup on Failure
        if: failure()
        run: |
          LOCK_ID=$(terraform force-unlock -force 2>&1 | grep -oP 'ID:\s+\K\S+')
          if [ ! -z "$LOCK_ID" ]; then
            terraform force-unlock -force $LOCK_ID
          fi
```

### 4. Lock Table Monitoring

```bash
# Create CloudWatch alarm for stuck locks
aws cloudwatch put-metric-alarm \
  --alarm-name terraform-lock-stuck \
  --alarm-description "Alert when Terraform lock exists for > 1 hour" \
  --metric-name LockAge \
  --namespace Custom/Terraform \
  --statistic Maximum \
  --period 300 \
  --threshold 3600 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1
```

---

## Common Scenarios

### Scenario 1: CI/CD Pipeline Cancelled

**Problem**: GitHub Actions workflow cancelled while running Terraform

**Solution**:
```bash
# Get the Lock ID from CI/CD logs
# In GitHub Actions, look for the error in the job output

# Locally force unlock
terraform force-unlock <LOCK_ID_FROM_CI>
```

### Scenario 2: Local Execution Interrupted

**Problem**: Laptop crash or network disconnect during apply

**Solution**:
```bash
# When system restarts, immediately run
terraform force-unlock <LOCK_ID>

# Then verify state integrity
terraform plan

# If plan shows unexpected changes, check state
terraform state list
```

### Scenario 3: Multiple Team Members

**Problem**: Two people run Terraform simultaneously

**Solution**:
```bash
# Implement workspace per developer
terraform workspace new dev-alice
terraform workspace new dev-bob

# Use separate state files
# backend.tf
terraform {
  backend "s3" {
    bucket = "terraform-state"
    key    = "env/${terraform.workspace}/terraform.tfstate"
    dynamodb_table = "terraform-state-lock"
  }
}
```

---

## Emergency Recovery

### If Terraform State is Corrupted

```bash
# 1. Backup current state
terraform state pull > backup-$(date +%s).tfstate

# 2. Force unlock
terraform force-unlock <LOCK_ID>

# 3. Verify state integrity
terraform state list

# 4. If state is corrupted, restore from backup
# List S3 versioning backups
aws s3api list-object-versions \
  --bucket terraform-state-bucket \
  --prefix terraform.tfstate

# Restore specific version
aws s3api get-object \
  --bucket terraform-state-bucket \
  --key terraform.tfstate \
  --version-id <VERSION_ID> \
  restored-state.tfstate

# 5. Push restored state (DANGEROUS - verify first!)
terraform state push restored-state.tfstate
```

---

## Verification Checklist

After resolving the lock issue:

- [ ] Force unlock successful
- [ ] `terraform plan` runs without errors
- [ ] State file is accessible
- [ ] No unexpected resource changes shown
- [ ] Team notified of lock resolution
- [ ] CI/CD pipeline rerun successful

---

## Best Practices Summary

✅ **DO**:
- Always wait for Terraform to complete
- Use workspaces for isolation
- Set timeouts in CI/CD
- Document lock IDs for recovery
- Enable S3 state versioning
- Use DynamoDB for locking

❌ **DON'T**:
- Interrupt Terraform with Ctrl+C unnecessarily
- Run Terraform from multiple locations simultaneously
- Delete locks without understanding the cause
- Ignore lock warnings
- Disable state locking

---

## Related Issues

- [AWS Resource Limits](09-aws-resource-limits.md)
- [VPC Configuration Errors](10-vpc-configuration.md)
- [Terraform Destroy Blocked](13-terraform-destroy-blocked.md)

---

## Additional Resources

- [Terraform State Locking Documentation](https://www.terraform.io/docs/language/state/locking.html)
- [AWS DynamoDB State Lock](https://www.terraform.io/docs/language/settings/backends/s3.html#dynamodb-state-locking)
- [Backend Configuration Best Practices](https://www.terraform.io/docs/language/settings/backends/configuration.html)

---

**Last Updated**: October 23, 2024  
**Author**: Shubhadeep  
**Tested On**: Terraform v1.5.0, AWS Provider v5.0+
