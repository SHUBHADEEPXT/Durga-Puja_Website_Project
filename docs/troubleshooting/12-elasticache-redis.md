# ElastiCache Redis Configuration and Connection Issues

**Issue ID**: REDIS-001  
**Date**: October 7-8, 2024  
**Severity**: MEDIUM  
**Status**: ✅ RESOLVED

---

## Problem Description

Redis connectivity and configuration issues encountered during deployment:

```
Error: Cannot connect to Redis from backend pods
Error: Connection timeout when accessing Redis endpoint
Error: Redis cluster subnet group configuration invalid
Warning: Redis not accessible from EKS cluster
```

**Screenshot Evidence**: 
- #60: ElastiCache dashboard showing Redis cluster overview
- #61: Redis cluster details with configuration and endpoints
- #74: Redis cluster status showing "Available"
- #81: Redis subnet group with 3 subnets across availability zones

---

## Root Cause Analysis

### Issue 1: Security Group Configuration

Redis ElastiCache cluster in private subnet requires security group rules to allow connections from EKS worker nodes on port 6379.

### Issue 2: Subnet Group Misconfiguration

ElastiCache requires a subnet group with subnets in multiple availability zones for high availability. Initial configuration may have used public subnets instead of private.

### Issue 3: Endpoint Resolution

Redis endpoint is only accessible within the VPC. Applications must use the correct endpoint format and be deployed in the same VPC.

### Issue 4: Authentication Requirements

Redis 7.0+ supports ACLs and requires proper authentication configuration for secure access.

---

## Solutions

### Fix 1: Security Group Configuration

```hcl
# modules/elasticache/main.tf

# Redis Security Group
resource "aws_security_group" "redis" {
  name_prefix = "durga-puja-redis-sg"
  description = "Security group for Redis ElastiCache"
  vpc_id      = var.vpc_id

  # Allow inbound Redis traffic from EKS worker nodes
  ingress {
    description     = "Redis port from EKS workers"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [var.eks_worker_security_group_id]
  }

  # Allow outbound traffic
  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "durga-puja-redis-sg"
  }

  lifecycle {
    create_before_destroy = true
  }
}
```

### Fix 2: Subnet Group Configuration

```hcl
# Redis Subnet Group - Must use PRIVATE subnets
resource "aws_elasticache_subnet_group" "redis" {
  name       = "durga-puja-redis-subnet-group"
  description = "Subnet group for Redis cluster"
  
  # Use private subnets only (10.0.10.0/24, 10.0.11.0/24, 10.0.12.0/24)
  subnet_ids = var.private_subnet_ids
  
  tags = {
    Name = "durga-puja-redis-subnet-group"
  }
}
```

**Verification from Screenshot #81:**
- ✅ Subnet Group Name: `durga-puja-redis-subnet-group`
- ✅ Subnets: 3 across us-east-1a, 1b, 1c
- ✅ CIDR Blocks: 10.0.10.0/24, 10.0.11.0/24, 10.0.12.0/24 (Private subnets)

### Fix 3: Redis Cluster Configuration

```hcl
# Redis Replication Group
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "durga-puja-redis"
  replication_group_description = "Redis cache for Durga Puja Platform"
  
  engine               = "redis"
  engine_version       = "7.0.7"
  node_type            = "cache.t3.micro"
  num_cache_clusters   = 2  # 1 primary + 1 replica
  port                 = 6379
  
  # High Availability Configuration
  automatic_failover_enabled = true
  multi_az_enabled          = true
  
  # Security Configuration
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token_enabled         = false  # Can enable for production
  
  # Network Configuration
  subnet_group_name    = aws_elasticache_subnet_group.redis.name
  security_group_ids   = [aws_security_group.redis.id]
  
  # Parameter Group
  parameter_group_name = "default.redis7"
  
  # Maintenance
  maintenance_window         = "sun:05:00-sun:06:00"
  snapshot_retention_limit   = 5
  snapshot_window           = "03:00-04:00"
  
  # Logging
  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.redis.name
    destination_type = "cloudwatch-logs"
    log_format       = "json"
    log_type         = "slow-log"
  }

  tags = {
    Name        = "durga-puja-redis"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

# CloudWatch Log Group for Redis
resource "aws_cloudwatch_log_group" "redis" {
  name              = "/aws/elasticache/durga-puja-redis"
  retention_in_days = 7

  tags = {
    Name = "durga-puja-redis-logs"
  }
}

# Outputs
output "redis_endpoint" {
  description = "Redis primary endpoint"
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
  sensitive   = true
}

output "redis_reader_endpoint" {
  description = "Redis reader endpoint"
  value       = aws_elasticache_replication_group.redis.reader_endpoint_address
  sensitive   = true
}
```

**Verification from Screenshot #61 & #74:**
- ✅ Cluster Name: `durga-puja-redis`
- ✅ Engine: Redis 7.0.7
- ✅ Node Type: cache.t3.micro
- ✅ Number of Nodes: 2
- ✅ Multi-AZ: Enabled
- ✅ Auto-Failover: Enabled
- ✅ Encryption in Transit: Enabled
- ✅ Status: Available

### Fix 4: Backend Application Configuration

Update the backend to use Redis endpoint:

```yaml
# kubernetes/backend-deployment.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: backend-config
  namespace: durga-puja
data:
  REDIS_HOST: "master.durga-puja-redis.hwvz7v.use1.cache.amazonaws.com"
  REDIS_PORT: "6379"
  REDIS_TLS: "true"  # Required for encryption in transit
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: durga-puja
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: difindoxt/durga-puja-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: REDIS_HOST
          valueFrom:
            configMapKeyRef:
              name: backend-config
              key: REDIS_HOST
        - name: REDIS_PORT
          valueFrom:
            configMapKeyRef:
              name: backend-config
              key: REDIS_PORT
        - name: REDIS_TLS
          valueFrom:
            configMapKeyRef:
              name: backend-config
              key: REDIS_TLS
```

---

## Connection Testing

### Step 1: Test from EKS Pod

```bash
# Deploy a test pod with redis-cli
kubectl run redis-test -it --rm --restart=Never \
  --image=redis:7.0 \
  --namespace=durga-puja \
  -- redis-cli -h master.durga-puja-redis.hwvz7v.use1.cache.amazonaws.com \
               -p 6379 \
               --tls \
               PING

# Expected output:
# PONG

# If it works, test SET/GET
kubectl run redis-test -it --rm --restart=Never \
  --image=redis:7.0 \
  --namespace=durga-puja \
  -- redis-cli -h master.durga-puja-redis.hwvz7v.use1.cache.amazonaws.com \
               -p 6379 \
               --tls \
               -c "SET testkey 'Hello from Kubernetes'"

# Then retrieve
kubectl run redis-test -it --rm --restart=Never \
  --image=redis:7.0 \
  --namespace=durga-puja \
  -- redis-cli -h master.durga-puja-redis.hwvz7v.use1.cache.amazonaws.com \
               -p 6379 \
               --tls \
               -c "GET testkey"

# Expected output:
# "Hello from Kubernetes"
```

### Step 2: Verify Security Group Rules

```bash
# Get Redis security group ID
REDIS_SG=$(aws elasticache describe-cache-clusters \
  --cache-cluster-id durga-puja-redis-001 \
  --query 'CacheClusters[0].SecurityGroups[0].SecurityGroupId' \
  --output text)

# Check inbound rules
aws ec2 describe-security-groups \
  --group-ids $REDIS_SG \
  --query 'SecurityGroups[0].IpPermissions' \
  --output table

# Expected: Port 6379 allowed from EKS worker security group
```

### Step 3: Check Redis Cluster Health

```bash
# Describe replication group
aws elasticache describe-replication-groups \
  --replication-group-id durga-puja-redis \
  --query 'ReplicationGroups[0].{
    Status: Status,
    MultiAZ: MultiAZ,
    AutoFailover: AutomaticFailover,
    Endpoint: NodeGroups[0].PrimaryEndpoint.Address
  }' \
  --output table

# Check node status
aws elasticache describe-cache-clusters \
  --cache-cluster-id durga-puja-redis-001 \
  --show-cache-node-info \
  --query 'CacheClusters[0].CacheNodes[*].{
    NodeId: CacheNodeId,
    Status: CacheNodeStatus,
    Endpoint: Endpoint.Address,
    AZ: CustomerAvailabilityZone
  }' \
  --output table
```

### Step 4: Monitor Redis Metrics

```bash
# CPU Utilization
aws cloudwatch get-metric-statistics \
  --namespace AWS/ElastiCache \
  --metric-name CPUUtilization \
  --dimensions Name=CacheClusterId,Value=durga-puja-redis-001 \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average \
  --query 'Datapoints[*].[Timestamp,Average]' \
  --output table

# Network Bytes In
aws cloudwatch get-metric-statistics \
  --namespace AWS/ElastiCache \
  --metric-name NetworkBytesIn \
  --dimensions Name=CacheClusterId,Value=durga-puja-redis-001 \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum \
  --output table
```

---

## Common Issues and Solutions

### Issue 1: Connection Timeout

**Symptom:**
```
Error: connection timeout
```

**Causes & Solutions:**
1. **Security Group:** EKS worker nodes not allowed
   ```bash
   # Fix: Update security group
   aws ec2 authorize-security-group-ingress \
     --group-id $REDIS_SG \
     --protocol tcp \
     --port 6379 \
     --source-group $EKS_WORKER_SG
   ```

2. **Wrong Subnet:** Redis in public subnet
   ```bash
   # Fix: Recreate in private subnet (requires destroy)
   terraform destroy -target=aws_elasticache_replication_group.redis
   terraform apply
   ```

### Issue 2: TLS Connection Failed

**Symptom:**
```
Error: SSL/TLS connection required
```

**Solution:**
```javascript
// Node.js Redis client configuration
const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  tls: {
    rejectUnauthorized: false  // For AWS ElastiCache
  }
});
```

### Issue 3: High Memory Usage

**Symptom:**
```
CloudWatch Alert: Memory usage > 80%
```

**Solutions:**
1. **Set maxmemory policy:**
   ```bash
   aws elasticache modify-cache-parameter-group \
     --cache-parameter-group-name default.redis7 \
     --parameter-name-values \
       "ParameterName=maxmemory-policy,ParameterValue=allkeys-lru"
   ```

2. **Scale up node type:**
   ```hcl
   # In Terraform
   resource "aws_elasticache_replication_group" "redis" {
     node_type = "cache.t3.small"  # Changed from cache.t3.micro
   }
   ```

3. **Implement cache eviction:**
   ```javascript
   // Set TTL on all keys
   await redis.setex('key', 3600, 'value');  // Expire in 1 hour
   ```

---

## Best Practices

### ✅ Security Best Practices

1. **Enable Encryption:**
   - ✅ At-rest encryption: Always enabled
   - ✅ In-transit encryption: Always enabled
   - ✅ Auth token: Enable for production

2. **Network Isolation:**
   - ✅ Deploy in private subnets only
   - ✅ Restrict security group to EKS only
   - ✅ No public access

3. **Access Control:**
   ```hcl
   # Enable Redis AUTH
   resource "aws_elasticache_replication_group" "redis" {
     auth_token_enabled = true
     auth_token         = var.redis_auth_token  # Store in secrets
   }
   ```

### ✅ High Availability Best Practices

1. **Multi-AZ Deployment:**
   ```hcl
   multi_az_enabled           = true
   automatic_failover_enabled = true
   num_cache_clusters         = 2  # Minimum for HA
   ```

2. **Backup Configuration:**
   ```hcl
   snapshot_retention_limit = 7
   snapshot_window         = "03:00-04:00"  # Off-peak hours
   ```

### ✅ Performance Best Practices

1. **Connection Pooling:**
   ```javascript
   // Use connection pooling in application
   const redis = require('redis');
   const { promisify } = require('util');
   
   const client = redis.createClient({
     host: process.env.REDIS_HOST,
     port: 6379,
     tls: { rejectUnauthorized: false },
     retry_strategy: (options) => {
       if (options.total_retry_time > 1000 * 60 * 60) {
         return new Error('Retry time exhausted');
       }
       if (options.attempt > 10) {
         return undefined;
       }
       return Math.min(options.attempt * 100, 3000);
     }
   });
   ```

2. **Use Read Replicas:**
   ```javascript
   // Read from replica endpoint
   const readClient = redis.createClient({
     host: process.env.REDIS_READER_ENDPOINT
   });
   ```

3. **Monitor Performance:**
   ```bash
   # Set CloudWatch alarms
   aws cloudwatch put-metric-alarm \
     --alarm-name redis-cpu-high \
     --alarm-description "Alert when CPU > 75%" \
     --metric-name CPUUtilization \
     --namespace AWS/ElastiCache \
     --statistic Average \
     --period 300 \
     --threshold 75 \
     --comparison-operator GreaterThanThreshold \
     --evaluation-periods 2
   ```

---

## Verification Checklist

After resolving Redis issues:

- [ ] Redis cluster status is "Available" (Screenshot #74 ✅)
- [ ] Security group allows EKS worker nodes on port 6379
- [ ] Subnet group uses private subnets only (Screenshot #81 ✅)
- [ ] Multi-AZ enabled for high availability
- [ ] Encryption at-rest and in-transit enabled
- [ ] Backup configured with retention policy
- [ ] CloudWatch alarms configured
- [ ] Connection test from EKS pod succeeds
- [ ] Application successfully reads/writes to Redis
- [ ] Monitoring dashboard shows healthy metrics

---

## Related Issues

- [VPC Configuration Errors](10-vpc-configuration.md) - Subnet configuration
- [EKS Cluster Access](16-eks-cluster-access.md) - Security group setup
- [RDS Connection Issues](11-rds-connection.md) - Similar database connectivity

---

## Additional Resources

- [AWS ElastiCache Best Practices](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/BestPractices.html)
- [Redis Security](https://redis.io/docs/management/security/)
- [ElastiCache Monitoring](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/CacheMetrics.html)
- [Terraform ElastiCache Module](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/elasticache_replication_group)

---

**Last Updated**: October 26, 2024  
**Author**: Shubhadeep  
**Tested On**: AWS ElastiCache Redis 7.0.7, EKS 1.28  
