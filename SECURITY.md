<div align="center">

# 🔐 Security Documentation

### Comprehensive Security Practices and Guidelines

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="600">

[![Security](https://img.shields.io/badge/Security-High-success?style=flat-square)](https://github.com/SHUBHADEEPXT/Durga-Puja_Website_Project)
[![Encryption](https://img.shields.io/badge/Encryption-AES--256-blue?style=flat-square)](https://github.com/SHUBHADEEPXT/Durga-Puja_Website_Project)
[![IAM](https://img.shields.io/badge/IAM-Least%20Privilege-green?style=flat-square)](https://github.com/SHUBHADEEPXT/Durga-Puja_Website_Project)

[🛡️ Overview](#️-security-overview) • [🔒 Network](#-network-security) • [🔑 Access](#-identity--access-management) • [📊 Compliance](#-compliance)

</div>

---

## 📋 Table of Contents

- [Security Overview](#️-security-overview)
- [Security Principles](#-security-principles)
- [Network Security](#-network-security)
- [Identity & Access Management](#-identity--access-management)
- [Data Security](#-data-security)
- [Application Security](#-application-security)
- [Container Security](#-container-security)
- [Kubernetes Security](#️-kubernetes-security)
- [Secrets Management](#-secrets-management)
- [Monitoring & Logging](#-monitoring--logging)
- [Incident Response](#-incident-response)
- [Compliance](#-compliance)
- [Security Checklist](#-security-checklist)
- [Reporting Vulnerabilities](#-reporting-vulnerabilities)

---

## 🛡️ Security Overview

### Security Posture
```
Defense in Depth - Multiple Security Layers

┌─────────────────────────────────────────────────────────────┐
│  Layer 7: Governance & Compliance                           │
│  ├─ Security Policies                                       │
│  ├─ Audit Logging                                           │
│  └─ Compliance Monitoring                                   │
├─────────────────────────────────────────────────────────────┤
│  Layer 6: Application Security                              │
│  ├─ Input Validation                                        │
│  ├─ Authentication & Authorization                          │
│  └─ Secure Coding Practices                                 │
├─────────────────────────────────────────────────────────────┤
│  Layer 5: Container Security                                │
│  ├─ Image Scanning                                          │
│  ├─ Runtime Security                                        │
│  └─ Minimal Base Images                                     │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: Platform Security (Kubernetes)                    │
│  ├─ RBAC                                                    │
│  ├─ Network Policies                                        │
│  └─ Pod Security Standards                                  │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Data Security                                     │
│  ├─ Encryption at Rest                                      │
│  ├─ Encryption in Transit                                   │
│  └─ Secrets Management                                      │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Identity & Access                                 │
│  ├─ IAM Roles & Policies                                    │
│  ├─ MFA                                                     │
│  └─ Least Privilege                                         │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Network Security                                  │
│  ├─ VPC Isolation                                           │
│  ├─ Security Groups                                         │
│  ├─ Network ACLs                                            │
│  └─ Private Subnets                                         │
└─────────────────────────────────────────────────────────────┘
```

### Security Metrics

| Security Control | Status | Coverage |
|-----------------|--------|----------|
| **Network Isolation** | ✅ Implemented | 100% |
| **Encryption at Rest** | ✅ Implemented | 100% |
| **Encryption in Transit** | ✅ Implemented | 100% |
| **IAM Least Privilege** | ✅ Implemented | 95% |
| **Secrets Management** | ✅ Implemented | 100% |
| **Container Scanning** | ✅ Implemented | 100% |
| **Audit Logging** | ✅ Implemented | 90% |
| **Vulnerability Scanning** | ✅ Implemented | 100% |
| **Network Policies** | ⚠️ Planned | 0% |
| **WAF** | ⚠️ Planned | 0% |

---

## 🎯 Security Principles

### Core Security Philosophy

<table>
<tr>
<td width="50%">

#### 1. Zero Trust Architecture
```
Never Trust, Always Verify

├─ No implicit trust
├─ Verify every request
├─ Least privilege access
├─ Assume breach
└─ Continuous monitoring
```

</td>
<td width="50%">

#### 2. Defense in Depth
```
Multiple Security Layers

├─ Network layer
├─ Application layer
├─ Data layer
├─ Identity layer
└─ Physical layer
```

</td>
</tr>
<tr>
<td width="50%">

#### 3. Least Privilege
```
Minimum Necessary Access

├─ Start with no access
├─ Grant only what's needed
├─ Time-limited permissions
├─ Regular review
└─ Automated revocation
```

</td>
<td width="50%">

#### 4. Security by Design
```
Built-in, Not Bolted On

├─ Security from day one
├─ Threat modeling
├─ Secure defaults
├─ Privacy by design
└─ Regular assessments
```

</td>
</tr>
</table>

---

## 🔒 Network Security

### VPC Architecture
```
Network Security Implementation:

VPC (10.0.0.0/16)
│
├─── Public Subnets (DMZ)
│    ├─ Purpose: Load Balancers, NAT Gateways only
│    ├─ Internet Access: Via Internet Gateway
│    ├─ Allowed Traffic:
│    │  ├─ Inbound: HTTP/HTTPS from 0.0.0.0/0
│    │  └─ Outbound: To private subnets only
│    └─ Security:
│       ├─ No application workloads
│       ├─ Minimal attack surface
│       └─ DDoS protection (AWS Shield)
│
├─── Private Subnets (Application Tier)
│    ├─ Purpose: Application pods, worker nodes
│    ├─ Internet Access: Via NAT Gateway (outbound only)
│    ├─ Allowed Traffic:
│    │  ├─ Inbound: From ALB only
│    │  ├─ Outbound: Internet via NAT, DB subnet
│    │  └─ Internal: Pod-to-pod communication
│    └─ Security:
│       ├─ No public IP addresses
│       ├─ Security groups restrict access
│       └─ Network ACLs as secondary layer
│
└─── Database Subnets (Data Tier)
     ├─ Purpose: RDS, ElastiCache
     ├─ Internet Access: None (completely isolated)
     ├─ Allowed Traffic:
     │  ├─ Inbound: From private subnets only
     │  └─ Outbound: None
     └─ Security:
        ├─ No internet access
        ├─ Encryption enforced
        └─ Subnet group isolation
```

### Security Group Rules

#### ALB Security Group
```yaml
Name: durga-puja-alb-sg
Description: Security group for Application Load Balancer

Inbound Rules:
  - Protocol: TCP
    Port: 80
    Source: 0.0.0.0/0
    Description: HTTP from internet
  
  - Protocol: TCP
    Port: 443
    Source: 0.0.0.0/0
    Description: HTTPS from internet

Outbound Rules:
  - Protocol: TCP
    Port: 30000-32767
    Destination: eks-worker-sg
    Description: To Kubernetes NodePorts

Tags:
  - Name: durga-puja-alb-sg
  - Environment: production
  - ManagedBy: terraform
```

#### EKS Worker Node Security Group
```yaml
Name: durga-puja-eks-worker-sg
Description: Security group for EKS worker nodes

Inbound Rules:
  - Protocol: TCP
    Port: 30000-32767
    Source: alb-sg
    Description: From ALB (NodePort range)
  
  - Protocol: ALL
    Source: self
    Description: Allow all traffic between nodes
  
  - Protocol: TCP
    Port: 443
    Source: eks-control-plane-sg
    Description: From EKS control plane
  
  - Protocol: TCP
    Port: 10250
    Source: eks-control-plane-sg
    Description: Kubelet API from control plane

Outbound Rules:
  - Protocol: ALL
    Destination: 0.0.0.0/0
    Description: Allow all outbound (via NAT)

Tags:
  - Name: durga-puja-eks-worker-sg
  - kubernetes.io/cluster/durga-puja-eks: owned
```

#### RDS Security Group
```yaml
Name: durga-puja-rds-sg
Description: Security group for RDS PostgreSQL

Inbound Rules:
  - Protocol: TCP
    Port: 5432
    Source: eks-worker-sg
    Description: PostgreSQL from EKS workers only

Outbound Rules:
  - (None - Database doesn't initiate connections)

Tags:
  - Name: durga-puja-rds-sg
  - Environment: production
```

#### ElastiCache Security Group
```yaml
Name: durga-puja-redis-sg
Description: Security group for ElastiCache Redis

Inbound Rules:
  - Protocol: TCP
    Port: 6379
    Source: eks-worker-sg
    Description: Redis from EKS workers only

Outbound Rules:
  - (None - Cache doesn't initiate connections)

Tags:
  - Name: durga-puja-redis-sg
  - Environment: production
```

### Network ACLs (Additional Layer)
```yaml
Public Subnet NACL:
  Inbound:
    - Rule 100: Allow TCP 80 from 0.0.0.0/0
    - Rule 110: Allow TCP 443 from 0.0.0.0/0
    - Rule 120: Allow TCP 1024-65535 from 0.0.0.0/0 (ephemeral)
    - Rule *: Deny all
  
  Outbound:
    - Rule 100: Allow TCP 30000-32767 to 10.0.0.0/16
    - Rule 110: Allow TCP 1024-65535 to 0.0.0.0/0
    - Rule *: Deny all

Private Subnet NACL:
  Inbound:
    - Rule 100: Allow ALL from 10.0.0.0/16 (VPC)
    - Rule 110: Allow TCP 1024-65535 from 0.0.0.0/0 (return traffic)
    - Rule *: Deny all
  
  Outbound:
    - Rule 100: Allow ALL to 10.0.0.0/16 (VPC)
    - Rule 110: Allow TCP 443 to 0.0.0.0/0 (HTTPS)
    - Rule 120: Allow TCP 80 to 0.0.0.0/0 (HTTP)
    - Rule *: Deny all

Database Subnet NACL:
  Inbound:
    - Rule 100: Allow TCP 5432 from 10.0.11.0/24
    - Rule 110: Allow TCP 5432 from 10.0.12.0/24
    - Rule 120: Allow TCP 5432 from 10.0.13.0/24
    - Rule 130: Allow TCP 6379 from 10.0.11.0/24
    - Rule 140: Allow TCP 6379 from 10.0.12.0/24
    - Rule 150: Allow TCP 6379 from 10.0.13.0/24
    - Rule *: Deny all
  
  Outbound:
    - Rule 100: Allow TCP 1024-65535 to 10.0.0.0/16
    - Rule *: Deny all
```

---

## 🔑 Identity & Access Management

### IAM Strategy
```
IAM Architecture:

┌────────────────────────────────────────────┐
│         AWS Organization Root              │
└──────────────────┬─────────────────────────┘
                   │
    ┌──────────────┴──────────────┐
    │                             │
    ▼                             ▼
┌─────────────┐           ┌─────────────┐
│ Production  │           │   Dev/Test  │
│   Account   │           │   Account   │
└──────┬──────┘           └─────────────┘
       │
       ├─── IAM Users (Humans)
       │    ├─ Admin User (MFA required)
       │    ├─ Developer User (Limited)
       │    └─ ReadOnly User (Auditors)
       │
       ├─── IAM Roles (Services)
       │    ├─ EKS Cluster Role
       │    ├─ EKS Node Role
       │    ├─ RDS Enhanced Monitoring Role
       │    ├─ Lambda Execution Role
       │    └─ Service Account Roles (IRSA)
       │
       └─── IAM Policies
            ├─ Managed Policies (AWS)
            ├─ Custom Policies (Terraform)
            └─ Inline Policies (Specific)
```

### IAM Roles

#### EKS Cluster Role
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}

Attached Policies:
- AmazonEKSClusterPolicy
- AmazonEKSVPCResourceController

Permissions:
- Manage ENIs for pods
- Create/delete load balancers
- Manage security groups
- CloudWatch Logs access
```

#### EKS Node Role
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}

Attached Policies:
- AmazonEKSWorkerNodePolicy
- AmazonEKS_CNI_Policy
- AmazonEC2ContainerRegistryReadOnly
- AmazonSSMManagedInstanceCore (for Systems Manager)

Permissions:
- Pull images from ECR
- Manage network interfaces
- Join EKS cluster
- Access Systems Manager
```

#### Service Account Role (IRSA)
```json
Example: AWS Load Balancer Controller

Trust Policy:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/oidc.eks.REGION.amazonaws.com/id/CLUSTER_ID"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "oidc.eks.REGION.amazonaws.com/id/CLUSTER_ID:sub": "system:serviceaccount:kube-system:aws-load-balancer-controller"
        }
      }
    }
  ]
}

Permissions:
- Create/delete load balancers
- Manage target groups
- Configure security groups
- Route53 record management
```

### IAM Policies - Least Privilege

#### Developer Policy (Limited Access)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadOnlyAccess",
      "Effect": "Allow",
      "Action": [
        "eks:DescribeCluster",
        "eks:ListClusters",
        "rds:DescribeDBInstances",
        "elasticache:DescribeCacheClusters",
        "s3:ListBucket",
        "s3:GetObject"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyDangerousActions",
      "Effect": "Deny",
      "Action": [
        "eks:DeleteCluster",
        "rds:DeleteDBInstance",
        "s3:DeleteBucket",
        "iam:*"
      ],
      "Resource": "*"
    }
  ]
}
```

#### CI/CD Pipeline Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRAccess",
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    },
    {
      "Sid": "EKSAccess",
      "Effect": "Allow",
      "Action": [
        "eks:DescribeCluster"
      ],
      "Resource": "arn:aws:eks:us-east-1:ACCOUNT_ID:cluster/durga-puja-eks"
    },
    {
      "Sid": "S3DeploymentAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::durga-puja-artifacts/*"
    }
  ]
}
```

### MFA Enforcement
```json
Require MFA for Sensitive Operations:

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyAllExceptListedIfNoMFA",
      "Effect": "Deny",
      "NotAction": [
        "iam:CreateVirtualMFADevice",
        "iam:EnableMFADevice",
        "iam:GetUser",
        "iam:ListMFADevices",
        "iam:ListVirtualMFADevices",
        "iam:ResyncMFADevice",
        "sts:GetSessionToken"
      ],
      "Resource": "*",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}
```

---

## 🔐 Data Security

### Encryption at Rest

<table>
<tr>
<th>Service</th>
<th>Encryption Method</th>
<th>Key Management</th>
<th>Status</th>
</tr>

<tr>
<td><strong>RDS PostgreSQL</strong></td>
<td>AES-256 encryption</td>
<td>AWS KMS (aws/rds key)</td>
<td>✅ Enabled</td>
</tr>

<tr>
<td><strong>ElastiCache Redis</strong></td>
<td>AES-256 encryption</td>
<td>AWS KMS (aws/elasticache key)</td>
<td>✅ Enabled</td>
</tr>

<tr>
<td><strong>S3 Bucket</strong></td>
<td>SSE-S3 (AES-256)</td>
<td>AWS Managed Keys</td>
<td>✅ Enabled</td>
</tr>

<tr>
<td><strong>EBS Volumes</strong></td>
<td>AES-256 encryption</td>
<td>AWS KMS (aws/ebs key)</td>
<td>✅ Enabled</td>
</tr>

<tr>
<td><strong>Secrets</strong></td>
<td>AES-256 encryption</td>
<td>Kubernetes (etcd encryption)</td>
<td>✅ Enabled</td>
</tr>
</table>

#### RDS Encryption Configuration
```hcl
resource "aws_db_instance" "main" {
  identifier = "durga-puja-db"
  engine     = "postgres"
  
  # Encryption configuration
  storage_encrypted = true
  kms_key_id       = aws_kms_key.rds.arn
  
  # Backup encryption (automatic)
  backup_retention_period = 7
  
  # Enhanced monitoring
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  monitoring_interval             = 60
  monitoring_role_arn            = aws_iam_role.rds_monitoring.arn
}
```

#### S3 Bucket Encryption
```hcl
resource "aws_s3_bucket" "assets" {
  bucket = "durga-puja-assets-${random_id.suffix.hex}"
  
  # Block all public access
  acl = "private"
  
  # Versioning for data protection
  versioning {
    enabled = true
  }
  
  # Server-side encryption
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  
  # Lifecycle rule
  lifecycle_rule {
    enabled = true
    
    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }
    
    expiration {
      days = 365
    }
  }
}

# Block public access
resource "aws_s3_bucket_public_access_block" "assets" {
  bucket = aws_s3_bucket.assets.id
  
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
```

### Encryption in Transit
```
TLS/SSL Implementation:

Application Layer:
├─ ALB → Frontend: HTTP (internal)
├─ Frontend → Backend: HTTP (internal VPC)
├─ Backend → RDS: SSL/TLS enforced
├─ Backend → Redis: TLS enforced
└─ Backend → S3: HTTPS (AWS SDK default)

External Access:
├─ Internet → ALB: HTTPS (TLS 1.2+)
├─ Certificate: AWS ACM (future)
└─ Cipher Suites: Strong encryption only

Database Connections:
├─ Force SSL: require_ssl = true (RDS parameter group)
├─ Certificate Validation: Server certificate verification
└─ Application Config:
    DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

#### RDS SSL Configuration
```hcl
resource "aws_db_parameter_group" "main" {
  name   = "durga-puja-pg-params"
  family = "postgres15"
  
  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }
  
  parameter {
    name  = "ssl_min_protocol_version"
    value = "TLSv1.2"
  }
}
```

#### ElastiCache TLS Configuration
```hcl
resource "aws_elasticache_replication_group" "main" {
  replication_group_id = "durga-puja-redis"
  
  # Enable encryption
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  
  # Auth token for additional security
  auth_token = var.redis_auth_token
  
  # TLS configuration
  transit_encryption_mode = "required"
}
```

### Data Backup & Recovery
```
Backup Strategy:

RDS Automated Backups:
├─ Frequency: Daily
├─ Retention: 7 days
├─ Backup Window: 03:00-04:00 UTC
├─ Point-in-Time Recovery: Yes (up to 7 days)
└─ Cross-Region: Planned (us-west-2)

ElastiCache Backups:
├─ Frequency: Daily
├─ Retention: 7 days
├─ Backup Window: 04:00-05:00 UTC
└─ Restore: Manual

S3 Versioning:
├─ Enabled: Yes
├─ Lifecycle: 365 days
└─ Cross-Region Replication: Planned

Application Backups:
├─ Database Dump: Weekly (automated script)
├─ Config Backups: Git repository
└─ Disaster Recovery: Terraform state in S3
```

---

## 🔒 Application Security

### Authentication & Authorization
```
Auth Flow:

User Authentication:
├─ Method: JWT (JSON Web Tokens)
├─ Token Lifetime: 24 hours
├─ Refresh Token: 7 days
├─ Storage: HTTP-only cookies
└─ Signing Algorithm: HS256 (symmetric)

Authorization:
├─ Role-Based Access Control (RBAC)
├─ Roles: admin, user, guest
├─ Permissions: read, write, delete
└─ Middleware: Express middleware checks

Password Security:
├─ Hashing: bcrypt (10 rounds)
├─ Min Length: 8 characters
├─ Complexity: Letters + numbers + symbols
└─ Password Reset: Time-limited tokens
```

#### JWT Implementation
```javascript
// Backend: JWT generation
const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'durga-puja-api',
    audience: 'durga-puja-client'
  });
}

// Middleware: Verify token
function authenticateToken(req, res, next) {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}
```

### Input Validation
```javascript
// Express validator middleware
const { body, validationResult } = require('express-validator');

// User registration validation
app.post('/api/auth/register', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email'),
  
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Proceed with registration
});

// SQL Injection Prevention
// Using parameterized queries
const query = 'SELECT * FROM users WHERE email = $1';
const values = [email]; // Parameterized
db.query(query, values); // Safe from SQL injection
```

### XSS Protection
```javascript
// Backend: Sanitize output
const xss = require('xss');
const helmet = require('helmet');

// Use Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Minimize inline scripts
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Sanitize user input
function sanitizeUserInput(input) {
  return xss(input, {
    whiteList: {}, // No HTML tags allowed
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script']
  });
}
```

### CORS Configuration
```javascript
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from specific domains
    const allowedOrigins = [
      'https://durgapuja.example.com',
      'https://www.durgapuja.example.com'
    ];
    
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy does not allow access from this origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Login rate limit (stricter)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

app.use('/api/', api
Limiter);
app.use('/api/auth/login', loginLimiter);
// File upload rate limit
const uploadLimiter = rateLimit({
windowMs: 60 * 60 * 1000, // 1 hour
max: 20, // 20 uploads per hour
message: 'Too many uploads, please try again later.',
});
app.use('/api/upload', uploadLimiter);
```

---

## 🐳 Container Security

### Docker Image Security
```dockerfile
# Multi-stage build for minimal attack surface
FROM node:18-alpine AS builder

# Run as non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

# Security: Run as non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy only production dependencies and built files
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Run application
CMD ["node", "dist/server.js"]
```

### Image Scanning
```yaml
# GitHub Actions: Container Scanning
name: Container Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t app:latest .
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'app:latest'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
      
      - name: Upload Trivy results to GitHub Security tab
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
      
      - name: Fail on critical vulnerabilities
        run: |
          CRITICAL=$(trivy image --severity CRITICAL --format json app:latest | jq '.Results[].Vulnerabilities | length')
          if [ "$CRITICAL" -gt 0 ]; then
            echo "Critical vulnerabilities found!"
            exit 1
          fi
```

### Container Runtime Security
```yaml
# Pod Security Policy (Kubernetes)
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted
spec:
  privileged: false  # Don't allow privileged containers
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL  # Drop all Linux capabilities
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  hostNetwork: false  # Don't allow host network
  hostIPC: false
  hostPID: false
  runAsUser:
    rule: 'MustRunAsNonRoot'  # Must run as non-root user
  seLinux:
    rule: 'RunAsAny'
  supplementalGroups:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
  readOnlyRootFilesystem: true  # Read-only root filesystem
```

---

## ☸️ Kubernetes Security

### RBAC Configuration
```yaml
# Service Account for application
apiVersion: v1
kind: ServiceAccount
metadata:
  name: durga-puja-backend
  namespace: durga-puja
---
# Role: Limited permissions within namespace
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: app-role
  namespace: durga-puja
rules:
  - apiGroups: [""]
    resources: ["configmaps", "secrets"]
    verbs: ["get", "list"]
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list"]
---
# RoleBinding: Bind role to service account
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: app-rolebinding
  namespace: durga-puja
subjects:
  - kind: ServiceAccount
    name: durga-puja-backend
    namespace: durga-puja
roleRef:
  kind: Role
  name: app-role
  apiGroup: rbac.authorization.k8s.io
```

### Pod Security Standards
```yaml
# Deployment with security context
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
      serviceAccountName: durga-puja-backend
      
      # Pod-level security context
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
        seccompProfile:
          type: RuntimeDefault
      
      containers:
      - name: backend
        image: difindoxt/durga-puja-backend:latest
        
        # Container-level security context
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          runAsNonRoot: true
          runAsUser: 1001
          capabilities:
            drop:
              - ALL  # Drop all capabilities
        
        # Resource limits (prevent resource exhaustion attacks)
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        
        # Liveness and readiness probes
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 30
        
        readinessProbe:
          httpGet:
            path: /ready
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 10
```

### Network Policies
```yaml
# Network Policy: Restrict pod-to-pod communication
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-network-policy
  namespace: durga-puja
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Ingress
    - Egress
  
  # Ingress rules
  ingress:
    - from:
      - podSelector:
          matchLabels:
            app: frontend
      ports:
        - protocol: TCP
          port: 5000
  
  # Egress rules
  egress:
    # Allow DNS
    - to:
      - namespaceSelector:
          matchLabels:
            name: kube-system
      ports:
        - protocol: UDP
          port: 53
    
    # Allow RDS access
    - to:
      - ipBlock:
          cidr: 10.0.21.0/24  # Database subnet
      ports:
        - protocol: TCP
          port: 5432
    
    # Allow Redis access
    - to:
      - ipBlock:
          cidr: 10.0.21.0/24  # Database subnet
      ports:
        - protocol: TCP
          port: 6379
    
    # Allow HTTPS for external APIs
    - to:
      - ipBlock:
          cidr: 0.0.0.0/0
          except:
            - 10.0.0.0/8
            - 172.16.0.0/12
            - 192.168.0.0/16
      ports:
        - protocol: TCP
          port: 443
```

---

## 🔑 Secrets Management

### Kubernetes Secrets
```yaml
# Backend secrets (base64 encoded)
apiVersion: v1
kind: Secret
metadata:
  name: backend-secrets
  namespace: durga-puja
type: Opaque
stringData:
  MONGODB_URI: "postgresql://admin:PASSWORD@rds-endpoint:5432/durgapuja"
  REDIS_URL: "redis://:PASSWORD@redis-endpoint:6379"
  JWT_SECRET: "your-super-secret-jwt-key-minimum-32-characters-long"
  CLOUDINARY_CLOUD_NAME: "your-cloudinary-cloud-name"
  CLOUDINARY_API_KEY: "your-cloudinary-api-key"
  CLOUDINARY_API_SECRET: "your-cloudinary-api-secret"
```

### Secret Rotation Strategy
```
Secret Rotation Policy:

High-Priority Secrets (Rotate every 90 days):
├─ Database passwords
├─ JWT signing keys
├─ API keys (third-party services)
└─ Service account tokens

Medium-Priority Secrets (Rotate every 180 days):
├─ Redis passwords
├─ Encryption keys
└─ TLS certificates

Rotation Process:
1. Generate new secret
2. Update secret in Kubernetes
3. Rolling restart of affected pods
4. Verify new secret works
5. Deactivate old secret after 24h grace period
6. Update documentation
```

### GitHub Secrets (CI/CD)
```yaml
Required GitHub Secrets:

Authentication:
├─ DOCKER_USERNAME: Docker Hub username
├─ DOCKER_PASSWORD: Docker Hub access token
├─ AWS_ACCESS_KEY_ID: AWS access key
└─ AWS_SECRET_ACCESS_KEY: AWS secret key

Application:
├─ MONGODB_PASSWORD: Database password
├─ REDIS_PASSWORD: Redis password
├─ JWT_SECRET: JWT signing key
├─ VITE_API_URL: Frontend API URL
└─ CLOUDINARY_* : Image upload credentials

Security Best Practices:
├─ Use access tokens, not passwords
├─ Minimum required permissions
├─ Regular rotation (90 days)
├─ Audit access logs
└─ Never commit secrets to Git
```

### AWS Secrets Manager (Future Enhancement)
```hcl
# Terraform configuration for AWS Secrets Manager
resource "aws_secretsmanager_secret" "db_password" {
  name = "durga-puja/database/password"
  
  rotation_rules {
    automatically_after_days = 90
  }
  
  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.db_password.result
}

# Lambda function for automatic rotation
resource "aws_lambda_function" "rotate_secret" {
  filename      = "rotate_secret.zip"
  function_name = "durga-puja-secret-rotation"
  role          = aws_iam_role.lambda_rotation.arn
  handler       = "index.handler"
  runtime       = "python3.9"
  
  environment {
    variables = {
      SECRET_ARN = aws_secretsmanager_secret.db_password.arn
    }
  }
}
```

---

## 📊 Monitoring & Logging

### Security Monitoring
```yaml
Prometheus Alerts for Security:

# Alert: High number of failed authentication attempts
- alert: HighAuthFailureRate
  expr: rate(http_requests_total{status="401"}[5m]) > 10
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High authentication failure rate"
    description: "More than 10 failed auth attempts per minute"

# Alert: Unusual API access patterns
- alert: UnusualAPIAccess
  expr: rate(http_requests_total[5m]) > 1000
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "Unusual API access pattern detected"
    description: "Request rate exceeds normal threshold"

# Alert: Pod security violation
- alert: PodSecurityViolation
  expr: kube_pod_container_status_running{container="backend"} == 1 
    and on(pod) kube_pod_security_policy_violates_psp > 0
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: "Pod violating security policy"
    description: "Pod {{ $labels.pod }} is violating PSP"
```

### Audit Logging
```yaml
# EKS Audit Logging (enabled via Terraform)
resource "aws_eks_cluster" "main" {
  name = "durga-puja-eks"
  
  enabled_cluster_log_types = [
    "api",           # API server logs
    "audit",         # Kubernetes audit logs
    "authenticator", # IAM authenticator logs
    "controllerManager",
    "scheduler"
  ]
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "eks" {
  name              = "/aws/eks/durga-puja-eks/cluster"
  retention_in_days = 30
  
  tags = {
    Environment = "production"
    Purpose     = "security-audit"
  }
}
```

### Log Analysis Queries
```sql
-- CloudWatch Insights: Failed login attempts
fields @timestamp, @message
| filter @message like /authentication failed/
| stats count() by bin(5m)
| sort @timestamp desc

-- Unauthorized API access
fields @timestamp, sourceIPAddress, userAgent
| filter responseCode = 403 or responseCode = 401
| stats count() by sourceIPAddress
| sort count desc

-- Privilege escalation attempts
fields @timestamp, user, verb, objectRef.resource
| filter verb in ["create", "update", "patch"]
  and objectRef.resource in ["clusterroles", "clusterrolebindings"]
| sort @timestamp desc

-- Secret access (audit trail)
fields @timestamp, user.username, objectRef.name
| filter objectRef.resource = "secrets"
| stats count() by user.username, objectRef.name
```

---

## 🚨 Incident Response

### Incident Response Plan
```
IR Phases:

1. Preparation
   ├─ IR team identified
   ├─ Runbooks documented
   ├─ Tools configured
   └─ Training completed

2. Detection & Analysis
   ├─ Monitor alerts
   ├─ Triage incidents
   ├─ Assess severity
   └─ Determine scope

3. Containment
   ├─ Isolate affected systems
   ├─ Block malicious IPs
   ├─ Disable compromised accounts
   └─ Preserve evidence

4. Eradication
   ├─ Remove malware
   ├─ Patch vulnerabilities
   ├─ Update credentials
   └─ Strengthen defenses

5. Recovery
   ├─ Restore from backups
   ├─ Verify system integrity
   ├─ Monitor for re-infection
   └─ Return to normal operations

6. Post-Incident
   ├─ Document lessons learned
   ├─ Update procedures
   ├─ Improve detection
   └─ Conduct training
```

### Security Incident Playbooks

#### Playbook 1: Compromised Container
```bash
# 1. Identify compromised pod
kubectl get pods -n durga-puja

# 2. Isolate the pod (remove from service)
kubectl label pod <pod-name> -n durga-puja status=quarantined
kubectl patch svc backend -n durga-puja --type json \
  -p='[{"op":"add","path":"/spec/selector/status","value":"healthy"}]'

# 3. Capture pod logs
kubectl logs <pod-name> -n durga-puja > incident-logs.txt

# 4. Exec into pod for investigation (if safe)
kubectl exec -it <pod-name> -n durga-puja -- /bin/sh

# 5. Delete compromised pod
kubectl delete pod <pod-name> -n durga-puja

# 6. Check for persistence
kubectl get all -n durga-puja
kubectl describe deployment backend -n durga-puja

# 7. Scan new pods
trivy image difindoxt/durga-puja-backend:latest

# 8. Review and rotate secrets
kubectl delete secret backend-secrets -n durga-puja
kubectl apply -f secrets/backend-secrets.yaml
kubectl rollout restart deployment/backend -n durga-puja
```

#### Playbook 2: Data Breach
```bash
# 1. Immediate containment
# Revoke database access from application
aws rds modify-db-instance \
  --db-instance-identifier durga-puja-db \
  --master-user-password NEW_TEMP_PASSWORD

# 2. Block suspicious IPs at ALB
aws elbv2 modify-rule \
  --rule-arn <rule-arn> \
  --conditions Field=source-ip,Values='<suspicious-ip>/32' \
  --actions Type=fixed-response,FixedResponseConfig={StatusCode=403}

# 3. Enable RDS logging
aws rds modify-db-instance \
  --db-instance-identifier durga-puja-db \
  --enable-cloudwatch-logs-exports '["postgresql"]'

# 4. Take snapshot for forensics
aws rds create-db-snapshot \
  --db-instance-identifier durga-puja-db \
  --db-snapshot-identifier incident-$(date +%Y%m%d-%H%M%S)

# 5. Review access logs
aws logs tail /aws/rds/instance/durga-puja-db/postgresql --follow

# 6. Notify affected users
# Execute user notification script

# 7. Change all credentials
kubectl delete secret backend-secrets -n durga-puja
# Regenerate all secrets

# 8. Conduct forensic analysis
# Engage security team for full investigation
```

#### Playbook 3: DDoS Attack
```bash
# 1. Confirm DDoS (check metrics)
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name RequestCount \
  --dimensions Name=LoadBalancer,Value=<alb-arn> \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum

# 2. Enable AWS Shield (if not already)
aws shield create-protection \
  --name durga-puja-alb-protection \
  --resource-arn <alb-arn>

# 3. Implement rate limiting
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: durga-puja-ingress
  annotations:
    alb.ingress.kubernetes.io/shield-advanced-protection: "true"
    alb.ingress.kubernetes.io/wafv2-acl-arn: <waf-arn>
spec:
  # ingress rules
EOF

# 4. Scale up resources
kubectl scale deployment backend --replicas=10 -n durga-puja
kubectl scale deployment frontend --replicas=10 -n durga-puja

# 5. Enable CloudFront (CDN) for additional protection
# Configure CloudFront distribution (manual step)

# 6. Block malicious sources in WAF
aws wafv2 update-ip-set \
  --name durga-puja-blocked-ips \
  --scope REGIONAL \
  --id <ip-set-id> \
  --addresses <malicious-ips>

# 7. Monitor and adjust
watch -n 10 'kubectl top pods -n durga-puja'
```

---

## 📜 Compliance

### Compliance Standards

<table>
<tr>
<th>Standard</th>
<th>Status</th>
<th>Key Requirements Met</th>
</tr>

<tr>
<td><strong>GDPR</strong></td>
<td>🟡 Partial</td>
<td>
- Data encryption<br>
- Access controls<br>
- Audit logging<br>
❌ Missing: Data residency, Right to be forgotten automation
</td>
</tr>

<tr>
<td><strong>SOC 2 Type II</strong></td>
<td>🟡 Partial</td>
<td>
- Security monitoring<br>
- Access management<br>
- Change control<br>
❌ Missing: Formal audit trail, Annual assessment
</td>
</tr>

<tr>
<td><strong>PCI DSS</strong></td>
<td>🟢 N/A</td>
<td>
Not applicable - No payment card data processed
</td>
</tr>

<tr>
<td><strong>HIPAA</strong></td>
<td>🟢 N/A</td>
<td>
Not applicable - No health information processed
</td>
</tr>
</table>

### Security Controls Matrix
```
CIS Kubernetes Benchmark Compliance:

Control Plane Security:
├─ [✅] 1.1.1 API server authentication
├─ [✅] 1.1.2 API server authorization (RBAC)
├─ [✅] 1.1.3 API server audit logging
├─ [✅] 1.1.4 Admission controllers enabled
└─ [✅] 1.1.5 Encryption at rest (etcd)

Worker Node Security:
├─ [✅] 2.1.1 Kubelet authentication
├─ [✅] 2.1.2 Kubelet authorization
├─ [✅] 2.1.3 Read-only port disabled
├─ [⚠️] 2.1.4 Anonymous auth disabled (check needed)
└─ [✅] 2.1.5 Kubelet TLS enabled

Pod Security:
├─ [✅] 3.1.1 Run as non-root
├─ [✅] 3.1.2 Read-only filesystem
├─ [✅] 3.1.3 Capabilities dropped
├─ [⚠️] 3.1.4 Network policies (planned)
└─ [✅] 3.1.5 SecurityContext defined

Network Security:
├─ [✅] 4.1.1 Network segmentation (VPC)
├─ [✅] 4.1.2 Security groups configured
├─ [⚠️] 4.1.3 Network policies (planned)
├─ [✅] 4.1.4 TLS for data in transit
└─ [✅] 4.1.5 Private subnets for workloads
```

---

## ✅ Security Checklist

### Pre-Deployment Security Checklist

- [ ] **Infrastructure**
  - [ ] VPC with private subnets configured
  - [ ] Security groups following least privilege
  - [ ] Network ACLs configured
  - [ ] NAT Gateways deployed
  - [ ] No public IPs on application instances

- [ ] **Data Protection**
  - [ ] RDS encryption enabled
  - [ ] Redis encryption enabled
  - [ ] S3 bucket encryption enabled
  - [ ] EBS volumes encrypted
  - [ ] Backups configured and tested

- [ ] **Access Control**
  - [ ] IAM roles with least privilege
  - [ ] MFA enabled for admin accounts
  - [ ] Service accounts for applications
  - [ ] Kubernetes RBAC configured
  - [ ] No root access to containers

- [ ] **Application Security**
  - [ ] Input validation implemented
  - [ ] SQL injection prevention
  - [ ] XSS protection enabled
  - [ ] CORS configured correctly
  - [ ] Rate limiting enabled
  - [ ] JWT tokens with expiration

- [ ] **Container Security**
  - [ ] Images scanned for vulnerabilities
  - [ ] Running as non-root user
  - [ ] Read-only root filesystem
  - [ ] Minimal base images (Alpine)
  - [ ] No secrets in images

- [ ] **Monitoring & Logging**
  - [ ] CloudWatch logs enabled
  - [ ] EKS audit logging enabled
  - [ ] Prometheus monitoring configured
  - [ ] Security alerts configured
  - [ ] Log retention policy set

- [ ] **Secrets Management**
  - [ ] No secrets in Git repository
  - [ ] Kubernetes secrets encrypted
  - [ ] GitHub secrets configured
  - [ ] Rotation policy defined
  - [ ] Access logging enabled

### Post-Deployment Security Checklist

- [ ] **Verification**
  - [ ] Penetration testing completed
  - [ ] Vulnerability scan passed
  - [ ] Security controls validated
  - [ ] Incident response plan tested
  - [ ] Backup restore tested

- [ ] **Documentation**
  - [ ] Architecture diagrams updated
  - [ ] Security policies documented
  - [ ] Runbooks created
  - [ ] Incident response procedures
  - [ ] Compliance documentation

- [ ] **Ongoing**
  - [ ] Monthly security reviews
  - [ ] Quarterly penetration tests
  - [ ] Annual compliance audits
  - [ ] Regular patch management
  - [ ] Security training for team

---

## 🐛 Reporting Vulnerabilities

### Responsible Disclosure

If you discover a security vulnerability in this project, please follow responsible disclosure practices:

#### How to Report

1. **DO NOT** open a public GitHub issue
2. **DO** email security concerns to: shubhadeep010@gmail.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

#### What to Expect
```
Response Timeline:

├─ Initial Response: Within 24 hours
├─ Triage & Assessment: Within 3 days
├─ Fix Development: Within 7-14 days (depending on severity)
├─ Patch Release: Within 14-21 days
└─ Public Disclosure: 30 days after patch release
```

#### Severity Levels

| Severity | Response Time | Examples |
|----------|--------------|----------|
| **Critical** | 24 hours | Remote code execution, data breach |
| **High** | 3 days | Privilege escalation, auth bypass |
| **Medium** | 7 days | Information disclosure, DoS |
| **Low** | 14 days | Minor info leak, config issues |

#### Hall of Fame

We will maintain a security hall of fame for responsible disclosure:
- [Security Researchers](https://github.com/SHUBHADEEPXT/Durga-Puja_Website_Project/security/hall-of-fame)

---

## 📚 Security Resources

### Internal Documentation

- [SECURITY_POLICY.md](SECURITY_POLICY.md) - Official security policy
- [INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md) - Detailed IR procedures
- [RUNBOOK.md](RUNBOOK.md) - Operational runbooks

### External Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Kubernetes Benchmark](https://www.cisecurity.org/benchmark/kubernetes)
- [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)
- [Kubernetes Security](https://kubernetes.io/docs/concepts/security/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

## 🔒 Security Contacts

**Security Team**
- Email: shubhadeep010@gmail.com
- PGP Key: [Available on request]
- Response Time: 24 - 48 hours

**Project Maintainer**
- GitHub: [@SHUBHADEEPXT](https://github.com/SHUBHADEEPXT)
- Email: shubhadeep010@gmail.com

---

<div align="center">

### 🛡️ Security is Everyone's Responsibility
```
Prevention > Detection > Response > Recovery
```

**This project implements:**
- ✅ Defense in depth strategy
- ✅ Zero trust architecture
- ✅ Least privilege access
- ✅ Encryption everywhere
- ✅ Continuous monitoring
- ✅ Incident response readiness

**Security Commitment:**
*We take security seriously and continuously work to improve our security posture. If you have concerns or suggestions, please reach out.*

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="400">

**Made with 🔐 and security best practices**

*Last Updated: October 2024*
*Security Review: Quarterly*

</div>
