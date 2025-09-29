# 🪷 Durga Puja Pandal Explorer - Enterprise DevOps Platform

A production-grade photo-sharing platform showcasing comprehensive DevOps practices including CI/CD automation, Infrastructure as Code, container orchestration, and cloud-native architecture.

![Build Status](https://github.com/SHUBHADEEPXT/Durga-Puja_Website_Project/workflows/Production%20CI/CD%20Pipeline/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18.x-brightgreen.svg)

---

## 🎯 Project Overview

This platform demonstrates enterprise-level DevOps implementation through a real-world application that allows users to discover and share Durga Puja pandal photos with location tagging, ratings, and social features.

**Key Highlight**: Complete infrastructure can be deployed to AWS with single command, then torn down to control costs while maintaining interview-ready artifacts.

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    INTERNET/CDN                         │
│                   (CloudFront)                          │
└────────────────────┬────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│              Application Load Balancer                  │
│                  (Auto-scaling)                         │
└───────────┬──────────────────────┬──────────────────────┘
│                      │
▼                      ▼
┌────────────────────┐  ┌────────────────────────┐
│   EKS Cluster      │  │   EKS Cluster          │
│   (Frontend Pods)  │  │   (Backend Pods)       │
│   - React/Vite     │  │   - Node.js/Express    │
│   - Nginx          │  │   - JWT Auth           │
└────────────────────┘  └──────────┬─────────────┘
│
┌──────────────┼──────────────┐
│              │              │
▼              ▼              ▼
┌───────────┐  ┌──────────┐  ┌──────────┐
│    RDS    │  │  Redis   │  │   S3     │
│ (MongoDB) │  │ (Cache)  │  │ (Images) │
└───────────┘  └──────────┘  └──────────┘
```
---

## 🚀 Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **React Query** - Data fetching

### Backend
- **Node.js + Express** - API server
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Redis** - Caching layer

### DevOps & Infrastructure
- **Docker** - Containerization
- **Kubernetes (EKS)** - Orchestration
- **Terraform** - Infrastructure as Code
- **ArgoCD** - GitOps deployment
- **Helm** - Package management
- **GitHub Actions** - CI/CD pipeline
- **Prometheus + Grafana** - Monitoring
- **HashiCorp Vault** - Secrets management
- **AWS CloudWatch** - Logging

---

## 📊 DevOps Features Implemented

### CI/CD Pipeline
- Multi-stage quality gates
- Automated testing (unit, integration, e2e)
- Security vulnerability scanning (Snyk, npm audit)
- Static code analysis (ESLint)
- Container image building and registry
- Multi-environment deployment (dev/staging/prod)

### Infrastructure as Code
- Modular Terraform configuration
- VPC with public/private subnets
- EKS cluster with auto-scaling
- RDS for database
- Application Load Balancer
- CloudFront CDN
- Route 53 DNS

### Container Orchestration
- Kubernetes manifests
- Helm charts for applications
- ArgoCD for GitOps
- Horizontal Pod Autoscaling
- Service mesh ready

### Monitoring & Observability
- Prometheus metrics collection
- Grafana dashboards
- ELK stack for logging
- CloudWatch integration
- Custom alerting rules

---

## 💰 Cost Optimization Strategy

### Phase 1: Free Tier (₹0/month)
- Frontend: Vercel
- Backend: Render/Railway
- Database: MongoDB Atlas (512MB)
- Images: Cloudinary (25GB)
- Monitoring: Grafana Cloud free tier

### Phase 2: AWS Development (₹300-500 one-time)
- Deploy complete infrastructure for testing
- Take comprehensive screenshots
- Record demo videos
- Tear down immediately

### Phase 3: Interview Period (₹0 or temporary deploy)
- Show documentation and screenshots
- One-command deployment if requested
- Run for interview duration only
- Automated teardown script

---

## 🎓 Interview Demonstration

This project showcases:

1. **Architecture Design** - Microservices, cloud-native patterns
2. **Infrastructure Automation** - Terraform modules, reusable code
3. **Container Orchestration** - Kubernetes, Helm, service mesh
4. **GitOps Methodology** - ArgoCD, declarative configuration
5. **CI/CD Mastery** - Automated pipelines, quality gates
6. **Security Practices** - Vault, RBAC, network policies
7. **Monitoring & Observability** - Full stack monitoring
8. **Cost Optimization** - Resource management, scaling strategies

---

## 📁 Project Structure
```
durga-puja-platform/
├── .github/workflows/       # CI/CD pipelines
├── frontend/                # React application
├── backend/                 # Node.js API
├── infrastructure/
│   ├── terraform/           # IaC modules
│   │   ├── modules/         # Reusable modules
│   │   └── environments/    # Environment configs
│   └── kubernetes/          # K8s manifests
│       ├── applications/    # App deployments
│       ├── argocd/          # GitOps configs
│       └── helm-charts/     # Helm packages
├── devops/
│   ├── monitoring/          # Prometheus/Grafana
│   ├── nginx/               # Reverse proxy
│   └── scripts/             # Automation scripts
└── docs/                    # Comprehensive documentation
```

---

## 🚀 Quick Start

### Local Development

#### Clone repository  
```
git clone https://github.com/SHUBHADEEPXT/Durga-Puja_Website_Project.git
cd Durga-Puja_Website_Project
```

#### Start with Docker Compose  
```
docker-compose up -d
```
#### Access applications
```
Frontend: http://localhost:3000
Backend: http://localhost:5000
Grafana: http://localhost:3001
```


### AWS Deployment (One Command)
- Initialize and deploy complete infrastructure
```
cd infrastructure/terraform
terraform init
terraform apply -auto-approve
```

### Deploy applications with ArgoCD
```
kubectl apply -f ../kubernetes/argocd/
```
### Access via Load Balancer URL
- Teardown (Cost Control)
- Destroy all AWS resources
```
terraform destroy -auto-approve
```

### Estimated cost: ₹300-500 for 2-3 days
📚 Documentation

- Architecture Details
- AWS Deployment Guide
- Interview Demonstration
- Cost Analysis
- Terraform Guide
- Kubernetes Setup
- Monitoring Setup
- Quick Start

---
## 🤝 Contributing

- Contributing See CONTRIBUTING.md for contribution guidelines.
- License This project is licensed under the MIT License - see LICENSE file. 👨‍💻 
- Author Shubhadeep Bhowmik
- GitHub: @SHUBHADEEPXT
- Project built to demonstrate enterprise-level DevOps capabilities

---

## 🙏 Acknowledgments

- Built with DevOps best practices from industry leaders
- Architecture inspired by cloud-native patterns
- Designed for real-world scalability and reliability
