# RDS Connection and Configuration Issues

**Issue ID**: RDS-001  
**Date**: October 7-8, 2024  
**Severity**: HIGH  
**Status**: ✅ RESOLVED

---

## Problem Description

Multiple RDS-related errors encountered during deployment:

```
Error: MasterUsername admin cannot be used as it is a reserved word
Error: InvalidParameterValue: Cannot find version 15.4 for postgres
Error: DBInstanceNotFound: Database instance not found
```

**Screenshot Evidence**: 
- #59: RDS creation error - PostgreSQL version 15.4 not available
- #68: Admin username reserved word error  
- #69: Fixed with username "dbadmin"
- #73: Successfully created RDS instance details

---

## Root Cause Analysis

### Issue 1: Reserved Username "admin"

PostgreSQL reserves certain usernames including "admin", "root", "postgres"

### Issue 2: PostgreSQL Version Mismatch

AWS RDS doesn't support all PostgreSQL versions. Version 15.4 specifically requested wasn't available in us-east-1 region at deployment time.

### Issue 3: Connection from EKS

RDS in private subnet requires proper security group configuration for EKS worker nodes to connect.

---

## Solutions

### Fix 1: Change Master Username

```hcl
# ❌ WRONG - Uses reserved word
resource "aws_db_instance" "main" {
  username = "admin"  # Reserved word!
}

# ✅ CORRECT - Uses allowed username
resource "aws_db_instance" "main" {
  identifier = "durga-puja-db"
  username   = "dbadmin"  # Changed from "admin"
  
  # Other configurations...
}
```

### Fix 2: Use Available PostgreSQL Version

```bash
# Check available versions
aws rds describe-db-engine-versions \
  --engine postgres \
  --query 'DBEngineVersions[*].EngineVersion' \
  --region us-east-1

# Output: 15.3, 15.2, 14.8, etc.
```

```hcl
# Updated configuration
resource "aws_db_instance" "main" {
  engine         = "postgres"
  engine_version = "15.3"  # Changed from "15.4"
}
```

### Fix 3: Security Group Configuration

```hcl
# RDS Security Group
resource "aws_security_group" "rds" {
  name        = "durga-puja-rds-sg"
  vpc_id      = aws_vpc.main.id
  
  # Allow inbound from EKS workers only
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_eks_cluster.main.vpc_config[0].cluster_security_group_id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

---

## Connection Testing

```bash
# Get RDS endpoint
terraform output rds_endpoint
# Output: durga-puja-db.xxxxx.us-east-1.rds.amazonaws.com:5432

# Test from EKS pod
kubectl run -it --rm psql-test --image=postgres:15 --restart=Never -- \
  psql -h durga-puja-db.xxxxx.us-east-1.rds.amazonaws.com \
       -U dbadmin \
       -d postgres

# If successful, you'll see:
# postgres=>
```

---

## Best Practices

✅ Never use reserved usernames (admin, root, postgres)
✅ Always check available engine versions before deployment
✅ Place RDS in private subnets
✅ Use security groups for access control
✅ Enable automated backups
✅ Use Multi-AZ for production

---

**Last Updated**: October 25, 2024
