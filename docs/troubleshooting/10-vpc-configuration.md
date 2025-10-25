#VPC Configuration Errors

**Issue ID**: VPC-001  
**Date**: October 7, 2024  
**Severity**: MEDIUM  
**Status**: ✅ RESOLVED

---

## Problem Description

VPC-related errors during Terraform deployment:

```
Error: error creating VPC: InvalidParameterValue: Invalid CIDR block
Error: error creating subnet: InvalidSubnet.Range
Error: error creating NAT Gateway: InvalidSubnet.InvalidState
```

**Screenshot Evidence**: #80 - Shows VPC with 9 subnets properly configured

---

## Root Cause Analysis

### Common VPC Configuration Issues

1. **CIDR Block Conflicts**: Overlapping CIDR ranges
2. **Subnet Size**: Insufficient IP addresses
3. **Availability Zone**: AZ not available in region
4. **Route Table**: Incorrect routing configuration
5. **NAT Gateway**: Deployed in wrong subnet type

---

## Solution

### Issue 1: CIDR Block Overlap

**Error**:
```
Error: InvalidParameterValue: CIDR block 10.0.0.0/16 overlaps with existing VPC
```

**Solution**:
```hcl
# Use non-overlapping CIDR
resource "aws_vpc" "main" {
  cidr_block = "10.1.0.0/16"  # Changed from 10.0.0.0/16
  
  tags = {
    Name = "durga-puja-vpc"
  }
}
```

### Issue 2: Subnet CIDR Calculation

**Error**:
```
Error: InvalidSubnet.Range: The CIDR block is invalid
```

**Solution**:
```hcl
# Correct subnet allocation
locals {
  vpc_cidr = "10.0.0.0/16"
  
  # Public subnets: 10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24
  public_subnet_cidrs = [
    "10.0.0.0/24",
    "10.0.1.0/24",
    "10.0.2.0/24"
  ]
  
  # Private subnets: 10.0.10.0/24, 10.0.11.0/24, 10.0.12.0/24
  private_subnet_cidrs = [
    "10.0.10.0/24",
    "10.0.11.0/24",
    "10.0.12.0/24"
  ]
  
  # Database subnets: 10.0.20.0/24, 10.0.21.0/24, 10.0.22.0/24
  database_subnet_cidrs = [
    "10.0.20.0/24",
    "10.0.21.0/24",
    "10.0.22.0/24"
  ]
}
```

### Issue 3: NAT Gateway in Wrong Subnet

**Error**:
```
Error: InvalidSubnet.InvalidState: NAT Gateway cannot be created in private subnet
```

**Solution**:
```hcl
# NAT Gateway MUST be in PUBLIC subnet
resource "aws_nat_gateway" "main" {
  count         = length(local.availability_zones)
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id  # PUBLIC subnet

  tags = {
    Name = "durga-puja-nat-${count.index + 1}"
  }
  
  depends_on = [aws_internet_gateway.main]
}
```

---

## Verification

```bash
# Check VPC
aws ec2 describe-vpcs --vpc-ids vpc-xxxxx

# Check subnets
aws ec2 describe-subnets --filters "Name=vpc-id,Values=vpc-xxxxx"

# Check route tables
aws ec2 describe-route-tables --filters "Name=vpc-id,Values=vpc-xxxxx"

# Test connectivity
aws ec2 describe-nat-gateways --filter "Name=vpc-id,Values=vpc-xxxxx"
```

---

**Last Updated**: October 23, 2024
EOF
cat /mnt/user-data/outputs/10-vpc-configuration.md
Output

# VPC Configuration Errors

**Issue ID**: VPC-001  
**Date**: October 7, 2024  
**Severity**: MEDIUM  
**Status**: ✅ RESOLVED

---

## Problem Description

VPC-related errors during Terraform deployment:

```
Error: error creating VPC: InvalidParameterValue: Invalid CIDR block
Error: error creating subnet: InvalidSubnet.Range
Error: error creating NAT Gateway: InvalidSubnet.InvalidState
```

**Screenshot Evidence**: #80 - Shows VPC with 9 subnets properly configured

---

## Root Cause Analysis

### Common VPC Configuration Issues

1. **CIDR Block Conflicts**: Overlapping CIDR ranges
2. **Subnet Size**: Insufficient IP addresses
3. **Availability Zone**: AZ not available in region
4. **Route Table**: Incorrect routing configuration
5. **NAT Gateway**: Deployed in wrong subnet type

---

## Solution

### Issue 1: CIDR Block Overlap

**Error**:
```
Error: InvalidParameterValue: CIDR block 10.0.0.0/16 overlaps with existing VPC
```

**Solution**:
```hcl
# Use non-overlapping CIDR
resource "aws_vpc" "main" {
  cidr_block = "10.1.0.0/16"  # Changed from 10.0.0.0/16
  
  tags = {
    Name = "durga-puja-vpc"
  }
}
```

### Issue 2: Subnet CIDR Calculation

**Error**:
```
Error: InvalidSubnet.Range: The CIDR block is invalid
```

**Solution**:
```hcl
# Correct subnet allocation
locals {
  vpc_cidr = "10.0.0.0/16"
  
  # Public subnets: 10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24
  public_subnet_cidrs = [
    "10.0.0.0/24",
    "10.0.1.0/24",
    "10.0.2.0/24"
  ]
  
  # Private subnets: 10.0.10.0/24, 10.0.11.0/24, 10.0.12.0/24
  private_subnet_cidrs = [
    "10.0.10.0/24",
    "10.0.11.0/24",
    "10.0.12.0/24"
  ]
  
  # Database subnets: 10.0.20.0/24, 10.0.21.0/24, 10.0.22.0/24
  database_subnet_cidrs = [
    "10.0.20.0/24",
    "10.0.21.0/24",
    "10.0.22.0/24"
  ]
}
```

### Issue 3: NAT Gateway in Wrong Subnet

**Error**:
```
Error: InvalidSubnet.InvalidState: NAT Gateway cannot be created in private subnet
```

**Solution**:
```hcl
# NAT Gateway MUST be in PUBLIC subnet
resource "aws_nat_gateway" "main" {
  count         = length(local.availability_zones)
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id  # PUBLIC subnet

  tags = {
    Name = "durga-puja-nat-${count.index + 1}"
  }
  
  depends_on = [aws_internet_gateway.main]
}
```

---

## Verification

```bash
# Check VPC
aws ec2 describe-vpcs --vpc-ids vpc-xxxxx

# Check subnets
aws ec2 describe-subnets --filters "Name=vpc-id,Values=vpc-xxxxx"

# Check route tables
aws ec2 describe-route-tables --filters "Name=vpc-id,Values=vpc-xxxxx"

# Test connectivity
aws ec2 describe-nat-gateways --filter "Name=vpc-id,Values=vpc-xxxxx"
```

---

**Last Updated**: October 25, 2024
