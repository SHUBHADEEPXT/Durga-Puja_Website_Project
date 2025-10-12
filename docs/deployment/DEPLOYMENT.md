<div align="center">

# 🚀 Deployment Guide

### Complete Step-by-Step Instructions for Deploying the Durga Puja DevOps Platform

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="600">

[![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)](https://terraform.io)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io)
[![AWS](https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com)

[📋 Prerequisites](#-prerequisites) • [🏗️ Infrastructure](#️-infrastructure-deployment) • [☸️ Kubernetes](#️-kubernetes-deployment) • [🔍 Verification](#-verification) • [🗑️ Cleanup](#️-cleanup)

</div>

---

## 📑 Table of Contents

- [Prerequisites](#-prerequisites)
- [Infrastructure Deployment](#️-infrastructure-deployment)
- [Kubernetes Deployment](#️-kubernetes-deployment)
- [Application Deployment](#-application-deployment)
- [Monitoring Setup](#-monitoring-setup)
- [GitOps Configuration](#-gitops-configuration)
- [Verification](#-verification)
- [Troubleshooting](#-troubleshooting)
- [Cleanup](#️-cleanup)

---

## 📋 Prerequisites

### 🔧 Required Tools

Install these tools before starting:

<table>
<tr>
<td width="50%">

**Command Line Tools**

### AWS CLI
```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Terraform
```
wget https://releases.hashicorp.com/terraform/1.5.0/terraform_1.5.0_linux_amd64.zip
unzip terraform_1.5.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

### kubectl
```
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### Helm
```
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

</td>
<td width="50%">

---

## Verify Installation

### Check versions
```
aws --version
```
 aws-cli/2.x.x  

```
terraform --version
```
 Terraform v1.5.0  

```
kubectl version --client
```
 Client Version: v1.28.x  

```
helm version
```
 version.BuildInfo{Version:"v3.x.x"}  

```
docker --version
```
 Docker version 20.x.x  

---

## 🔑 AWS Account Setup

1. Create IAM User

- Create IAM user with admin access
```
aws iam create-user --user-name terraform-deployer
```

- Attach AdministratorAccess policy (for demo only)
```
aws iam attach-user-policy \
  --user-name terraform-deployer \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

- Create access keys
```
aws iam create-access-key --user-name terraform-deployer
```

**⚠️ Security Note: In production, use least-privilege IAM policies instead of AdministratorAccess.**

2. Configure AWS CLI
```
aws configure
```

- Enter your credentials:

AWS Access Key ID [None]: YOUR_ACCESS_KEY_ID  
AWS Secret Access Key [None]: YOUR_SECRET_ACCESS_KEY  
Default region name [None]: us-east-1  
Default output format [None]: json  

3. Verify AWS Configuration 

- Test AWS connectivity
```
aws sts get-caller-identity
```

- Expected output:
{
    "UserId": "AIDXXXXXXXXXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/terraform-deployer"
}

---

## 🐳 Docker Hub Setup

1. Create Docker Hub Account
- Visit Docker Hub and create an account.  

2. Create Access Token
- Login to Docker Hub
```
docker login
```

- Or create access token from Docker Hub Settings → Security

---

## 🔐 GitHub Secrets Setup
- Navigate to: https://github.com/YOUR_USERNAME/Durga-Puja_Website_Project/settings/secrets/actions

Add these secrets:

| 🧩 **Secret Name**      | 📝 **Description**        | 💡 **Example Value**                       |
| ----------------------- | ------------------------- | ------------------------------------------ |
| `AWS_ACCESS_KEY_ID`     | AWS Access Key            | `AKsdsaadODNN7EXAMPLE`                     |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key            | `wJlradasdFEMI/K7MDENG/bPxascCYEXAMPLEKEY` |
| `DOCKER_USERNAME`       | Docker Hub username       | `yourusername`                             |
| `DOCKER_PASSWORD`       | Docker Hub password/token | `dckr_pat_xxxxx`                           |
| `MONGODB_PASSWORD`      | Database password         | `SecurePassword123!`                       |
| `REDIS_PASSWORD`        | Redis password            | `SecureRedisPass456!`                      |
| `VITE_API_URL`          | Frontend API base URL     | `http://your-lb-url.com/api`               |

---

## 🏗️ Infrastructure Deployment

### Step 1: Clone Repository
- Clone the repository
```
git clone https://github.com/SHUBHADEEPXT/Durga-Puja_Website_Project.git
cd Durga-Puja_Website_Project
```
### Step 2: Review Terraform Configuration
```
cd infrastructure/terraform
```
-  Check the structure
```
tree -L 2
```
- Output:
.
├── main.tf              # Main configuration
├── variables.tf         # Input variables
├── outputs.tf          # Output values
├── terraform.tfvars    # Variable values
├── modules/
│   ├── vpc/           # VPC module
│   ├── eks/           # EKS module
│   ├── rds/           # RDS module
│   └── elasticache/   # ElastiCache module
└── backend.tf         # State backend config

### Step 3: Initialize Terraform
- Initialize Terraform (downloads providers)
```
terraform init
```

- Expected output:
Initializing modules...
Initializing the backend...
Initializing provider plugins...
- Finding latest version of hashicorp/aws...
- Installing hashicorp/aws v5.x.x...

Terraform has been successfully initialized!

### Step 4: Validate Configuration
- Check syntax
```
terraform fmt -recursive
```
-  Validate configuration
```
terraform validate
```
- Expected output:
Success! The configuration is valid.

### Step 5: Review Infrastructure Plan
- Generate and review plan
```
terraform plan
```
- Save plan to file (optional)
```
terraform plan -out=tfplan
```
- Expected Resources to be Created:

✅ VPC with 9 subnets across 3 AZs  
✅ Internet Gateway  
✅ 3 NAT Gateways  
✅ Route Tables (6)  
✅ Security Groups (5)  
✅ EKS Cluster  
✅ EKS Node Groups (2)  
✅ RDS PostgreSQL Instance  
✅ ElastiCache Redis Cluster  
✅ S3 Bucket  
✅ IAM Roles and Policies (~15)  

Total Resources: ~49

### Step 6: Deploy Infrastructure
- Apply the configuration
```
terraform apply -auto-approve
```
- This takes approximately 20-25 minutes
- Deployment Timeline:

⏱️  0-5 min:   VPC, Subnets, NAT Gateways created  
⏱️  5-15 min:  EKS Cluster creation (longest step)  
⏱️  15-20 min: RDS, ElastiCache, Node Groupss  
⏱️  20-25 min: IAM roles, Security groups finalization  

### Step 7: Capture Outputs
- Save all outputs
```
terraform output > ../outputs.txt
```
- Important outputs:

terraform output eks_cluster_endpoint  
terraform output rds_endpoint  
terraform output redis_endpoint  
terraform output configure_kubectl  

Sample Output:
hclconfigure_kubectl = "aws eks update-kubeconfig --region us-east-1 --name durga-puja-eks"  
eks_cluster_endpoint = "https://XXXXX.gr7.us-east-1.eks.amazonaws.com"  
eks_cluster_name = "durga-puja-eks"  
rds_endpoint = "durga-puja-db.xxxxx.us-east-1.rds.amazonaws.com:5432"  
redis_endpoint = "master.durga-puja-redis.xxxxx.use1.cache.amazonaws.com:6379"  
s3_bucket_name = "durga-puja-assets-xxxxx"  
vpc_id = "vpc-0xxxxx"  

---

## ☸️ Kubernetes Deployment

### Step 1: Configure kubectl
-  Configure kubectl to connect to EKS cluster
```
aws eks update-kubeconfig --region us-east-1 --name durga-puja-eks
```
- Verify connection
```
kubectl get nodes
```
- Expected output:  
NAME                         STATUS   ROLES    AGE   VERSION
ip-10-0-11-xx.ec2.internal   Ready    <none>   5m    v1.28.x
ip-10-0-12-xx.ec2.internal   Ready    <none>   5m    v1.28.x
ip-10-0-13-xx.ec2.internal   Ready    <none>   5m    v1.28.x
  

### Step 2: Install AWS Load Balancer Controller
- Add EKS Helm repository
```
helm repo add eks https://aws.github.io/eks-charts
helm repo update
```
- Install AWS Load Balancer Controller
```
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=durga-puja-eks \
  --set serviceAccount.create=false
```
- Verify installation
```
kubectl get deployment -n kube-system aws-load-balancer-controller
```

- Expected output:  

NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           1m
  
### Step 3: Update Kubernetes Secrets
```
cd ../kubernetes/secrets
```
-  Get RDS and Redis endpoints from Terraform output

RDS_ENDPOINT=$(cd ../../terraform && terraform output -raw rds_endpoint)  
REDIS_ENDPOINT=$(cd ../../terraform && terraform output -raw redis_endpoint)  

echo "RDS: $RDS_ENDPOINT"  
echo "Redis: $REDIS_ENDPOINT"  
Edit backend-secrets.yaml:  
yamlapiVersion: v1  
kind: Secret  
metadata:  
  name: backend-secrets  
  namespace: durga-puja  
type: Opaque  
stringData:  
  # Update with actual endpoints from Terraform output  
  MONGODB_URI: "postgresql://admin:YOUR_PASSWORD@${RDS_ENDPOINT}/durgapuja"  
  REDIS_URL: "redis://:YOUR_REDIS_PASSWORD@${REDIS_ENDPOINT}"  
  JWT_SECRET: "your-super-secret-jwt-key-change-in-production"   
  CLOUDINARY_CLOUD_NAME: "your-cloudinary-cloud-name"  
  CLOUDINARY_API_KEY: "your-cloudinary-api-key"  
  CLOUDINARY_API_SECRET: "your-cloudinary-api-secret"  

---

## 📦 Application Deployment

### Step 1: Create Namespaces
```
cd ../kubernetes
```
-  Apply namespaces
```
kubectl apply -f namespaces/
```
-  Expected output:
namespace/durga-puja created
Step 2: Apply ConfigMaps
bash# Apply configuration
kubectl apply -f configmaps/

- Verify
```
kubectl get configmap -n durga-puja
```
- Expected output:  
NAME              DATA   AGE
backend-config    5      10s
frontend-config   3      10s
  
### Step 3: Apply Secrets
- Apply secrets
```
kubectl apply -f secrets/
```
- Verify (values should be hidden)
```
kubectl get secrets -n durga-puja
```
- Expected output:  
NAME              TYPE     DATA   AGE
backend-secrets   Opaque   6      10s

### Step 4: Deploy Applications
- Deploy backend and frontend
```
kubectl apply -f deployments/
```
- Expected output:  

deployment.apps/backend created
horizontalpodautoscaler.autoscaling/backend-hpa created
deployment.apps/frontend created
horizontalpodautoscaler.autoscaling/frontend-hpa created

## Monitor Deployment:
- Watch pods being created
```
kubectl get pods -n durga-puja -w
```
- Expected progression:  
NAME                       READY   STATUS              RESTARTS   AGE
backend-xxxxx-xxxxx        0/1     ContainerCreating   0          10s
backend-xxxxx-xxxxx        0/1     Running             0          30s
backend-xxxxx-xxxxx        1/1     Running             0          45s
frontend-xxxxx-xxxxx       0/1     ContainerCreating   0          10s
frontend-xxxxx-xxxxx       1/1     Running             0          40s

### Step 5: Create Services
- Apply services
```
kubectl apply -f services/
```
- Verify services
```
kubectl get svc -n durga-puja
```
- Expected output:  
NAME               TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
backend-service    ClusterIP      172.20.XX.XX     <none>        5000/TCP       30s
frontend-service   LoadBalancer   172.20.XX.XX     <pending>     80:30XXX/TCP   30s

### Step 6: Create Ingress
- Apply ingress
```
kubectl apply -f ingress/
```
-  Watch for Load Balancer creation (takes 2-3 minutes)
```
kubectl get ingress -n durga-puja -w
```
- Expected output after 2-3 minutes:  
NAME                 CLASS   HOSTS   ADDRESS                                    PORTS   AGE
durga-puja-ingress   alb     *       k8s-durgapuj-xxxxx-xxxxx.us-east-1.elb.amazonaws.com   80      3m
  
### Step 7: Wait for Application to be Ready
- Check deployment status
```
kubectl rollout status deployment/backend -n durga-puja
kubectl rollout status deployment/frontend -n durga-puja
```
- Expected output:  
deployment "backend" successfully rolled out
deployment "frontend" successfully rolled out

- Get all resources
```
kubectl get all -n durga-puja
```

---

## 📊 Monitoring Setup

### Step 1: Install Prometheus & Grafana
- Add Prometheus Helm repository
```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```
- Install kube-prometheus-stack
```
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.adminPassword=admin123 \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --wait \
  --timeout 10m
```
- This takes 5-7 minutes

### Step 2: Verify Monitoring Installation
- Check monitoring namespace
```
kubectl get pods -n monitoring
```
- Expected output:  
NAME                                                   READY   STATUS    RESTARTS   AGE
monitoring-grafana-xxxxx-xxxxx                         3/3     Running   0          5m
monitoring-kube-prometheus-operator-xxxxx-xxxxx        1/1     Running   0          5m
monitoring-kube-state-metrics-xxxxx-xxxxx              1/1     Running   0          5m
monitoring-prometheus-node-exporter-xxxxx              1/1     Running   0          5m
prometheus-monitoring-kube-prometheus-prometheus-0     2/2     Running   0          5m

### Step 3: Access Grafana
- Port forward Grafana to local machine
```
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
```
- Access Grafana:
	URL: http://localhost:3000
	Username: admin
	Password: admin123

- Available Dashboards:

Kubernetes / Compute Resources / Cluster
Kubernetes / Compute Resources / Namespace (Pods)
Kubernetes / Compute Resources / Node (Pods)
Node Exporter / Nodes

## Step 4: Access Prometheus
-  Port forward Prometheus
```
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090
```

-  Access Prometheus:
	URL: http://localhost:9090

---

## 🔄 GitOps Configuration

### Step 1: Install ArgoCD
- Create ArgoCD namespace
```
kubectl create namespace argocd
```
- Install ArgoCD
```
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```
- Wait for ArgoCD pods (takes 3-5 minutes)
```
kubectl get pods -n argocd -w
```

### Step 2: Get ArgoCD Admin Password
- Retrieve admin password
```
ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d)

echo "ArgoCD Admin Password: $ARGOCD_PASSWORD"
```

- Save this password!

### Step 3: Access ArgoCD UI
-  Port forward ArgoCD server
```
kubectl port-forward -n argocd svc/argocd-server 8080:443
```
- Access ArgoCD:
	URL: https://localhost:8080
	Username: admin
	Password: (from previous step)

### Step 4: Create ArgoCD Application
- Option A: Via UI

	Click "+ NEW APP"
	Fill in details:

	Application Name: durga-puja-platform
	Project: default
	Sync Policy: Automatic
	Repository URL: https://github.com/SHUBHADEEPXT/Durga-Puja_Website_Project
	Revision: main
	Path: infrastructure/kubernetes
	Cluster URL: https://kubernetes.default.svc
	Namespace: durga-puja


	Click "CREATE"

- Option B: Via CLI
- Install ArgoCD CLI
```
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
```
- Login
```
argocd login localhost:8080 --username admin --password $ARGOCD_PASSWORD --insecure
```
- Create application
```
argocd app create durga-puja-platform \
  --repo https://github.com/SHUBHADEEPXT/Durga-Puja_Website_Project \
  --path infrastructure/kubernetes \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace durga-puja \
  --sync-policy automated \
  --auto-prune \
  --self-heal
```

- Option C: Via Kubernetes Manifest
```
cat <<EOF | kubectl apply -f -
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: durga-puja-platform
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/SHUBHADEEPXT/Durga-Puja_Website_Project
    targetRevision: main
    path: infrastructure/kubernetes
  destination:
    server: https://kubernetes.default.svc
    namespace: durga-puja
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
EOF
```

### Step 5: Verify ArgoCD Sync
- Check application status
```
kubectl get applications -n argocd
```
- Expected output:  
NAME                   SYNC STATUS   HEALTH STATUS
durga-puja-platform    Synced        Healthy

- View sync details
```
argocd app get durga-puja-platform
```
---

## 🔍 Verification

### ✅ Infrastructure Verification
- Check VPC
```
aws ec2 describe-vpcs --filters "Name=tag:Name,Values=durga-puja-vpc"
```
- Check EKS Cluster
```
aws eks describe-cluster --name durga-puja-eks --query 'cluster.status'
```
- Check RDS
```
aws rds describe-db-instances --db-instance-identifier durga-puja-db
```
- Check ElastiCache
```
aws elasticache describe-cache-clusters --cache-cluster-id durga-puja-redis
```

### ✅ Kubernetes Verification
- Check cluster info
```
kubectl cluster-info
```
- Check nodes
```
kubectl get nodes -o wide
```
- Check all resources
```
kubectl get all -n durga-puja
```
- Check pod logs
```
kubectl logs -n durga-puja deployment/backend --tail=50
kubectl logs -n durga-puja deployment/frontend --tail=50
```

### ✅ Application Verification
- Get application URL
```
APP_URL=$(kubectl get ingress -n durga-puja durga-puja-ingress \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

echo "Application URL: http://$APP_URL"
```
- Test backend health
```
curl http://$APP_URL/api/health
```
- Test frontend
```
curl http://$APP_URL
```

### ✅ Monitoring Verification
- Check Prometheus targets
```
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090 &
curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | .health'
```
- All should return "up"

### ✅ Auto-scaling Verification
- Check HPA status
```
kubectl get hpa -n durga-puja
```
- Expected output:  
NAME           REFERENCE             TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
backend-hpa    Deployment/backend    15%/70%   3         10        3          10m
frontend-hpa   Deployment/frontend   12%/70%   3         10        3          10m
  
- Generate load (optional - test scaling)
```
kubectl run load-generator --image=busybox --restart=Never -- /bin/sh -c \
  "while true; do wget -q -O- http://backend-service.durga-puja:5000/api/health; done"
```
- Watch HPA scale up
```
kubectl get hpa -n durga-puja -w
```

---

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: Pods Stuck in Pending
- Check pod events
```
kubectl describe pod <pod-name> -n durga-puja
```
- Common causes:
	- Insufficient node resouces
	- Image pull errors
	- PVC issues

- Solution: Check node resources
```
kubectl top nodes
kubectl describe nodes
```

### Issue 2: ImagePullBackOff
- Check image name
```
kubectl get deployment backend -n durga-puja -o yaml | grep image
```
- Verify image exists in Docker Hub
```
docker pull difindoxt/durga-puja-backend:latest
```
- Solution: Update image name if incorrect
```
kubectl set image deployment/backend \
  backend=difindoxt/durga-puja-backend:latest \
  -n durga-puja
```

### Issue 3: Ingress No Address
- Check Load Balancer Controller
```
kubectl get deployment -n kube-system aws-load-balancer-controller
```
- If not installed, install it:
```
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=durga-puja-eks
```
- Wait 2-3 minutes and check again
```
kubectl get ingress -n durga-puja
```

### Issue 4: Database Connection Failed
- Check RDS security group
```
aws rds describe-db-instances \
  --db-instance-identifier durga-puja-db \
  --query 'DBInstances[0].VpcSecurityGroups'
```
- Verify security group allows traffic from EKS nodes
- Check pod logs for connection errors
```
kubectl logs deployment/backend -n durga-puja
```

### Issue 5: Terraform State Lock
- If terraform commands hang with "Acquiring state lock..."
- Force unlock (use with caution)
```
terraform force-unlock <LOCK_ID>
```
- Find lock ID in the error message

---

## 🗑️ Cleanup
⚠️ Important: Complete Cleanup to Avoidd Charges   

###Step 1: Delete Kubernetes Resources
- Delete application
```
kubectl delete namespace durga-puja
```
- Delete monitoring
```
helm uninstall monitoring -n monitoring
kubectl delete namespace monitoring
```
- Delete ArgoCD
```
kubectl delete namespace argocd
```
- Wait for Load Balancers to be deleted (2-3 minutes)
sleep 180

### Step 2: Delete AWS Load Balancers (If Still Present)
- Find Load Balancers
```
aws elbv2 describe-load-balancers \
  --query "LoadBalancers[?VpcId=='$(cd infrastructure/terraform && terraform output -raw vpc_id)'].LoadBalancerArn" \
  --output text
```
- Delete each Load Balancer
```
aws elbv2 delete-load-balancer --load-balancer-arn <ARN>
```
- Delete Target Groups
```
aws elbv2 describe-target-groups \
  --query "TargetGroups[?VpcId=='$(cd infrastructure/terraform && terraform output -raw vpc_id)'].TargetGroupArn" \
  --output text

aws elbv2 delete-target-group --target-group-arn <ARN>
```

### Step 3: Destroy Terraform Infrastructure
```
cd infrastructure/terraform
```
- Destroy all resources
```
terraform destroy -auto-approve
```
- This takes 8-10 minutes

### Step 4: Verify Complete Cleanup

- Check for remaining resources
```
aws eks list-clusters
aws rds describe-db-instances
aws elasticache describe-cache-clusters
aws ec2 describe-vpcs --filters "Name=tag:Name,Values=durga-puja-vpc"
```
- All should return empty or not found

### Step 5: Clean Local State
- Remove Terraform state files (optional)
```
rm -rf .terraform/
rm terraform.tfstate*
rm tfplan
```
- Remove kubeconfig context
```
kubectl config delete-context arn:aws:eks:us-east-1:ACCOUNT_ID:cluster/durga-puja-eks
```

---

## 📊 Deployment Checklist

- Use this checklist to track your deployment progress:

	- Prerequisites installed and verified
	- AWS credentials configured
	- GitHub secrets added
	- Docker Hub account created
	- Repository cloned
	- Terraform initialized
	- Infrastructure deployed (25 min)
	- kubectl configured
	- AWS Load Balancer Controller installed
	- Kubernetes secrets updated
	- Application deployed
	- Services and Ingress created
	- Monitoring stack installed
	- ArgoCD installed and configured
	- Application accessible via Load Balancer
	- Grafana dashboards working
	- ArgoCD syncing successfully
 
## Screenshots taken
	- Infrastructure destroyed
	- Cleanup verified

---

## 💡 Best Practices

- Security

✅ Use IAM roles instead of access keys when possible  
✅ Enable encryption at rest for RDS and S3  
✅ Use private subnets for application workloads  
✅ Implement network policies in Kubernetes  
✅ Rotate secrets regularly   
✅ Use AWS Secrets Manager for production  

- Cost Optimization

✅ Use spot instances for non-production workloads  
✅ Enable EKS cluster autoscaler  
✅ Right-size RDS and ElastiCache instances  
✅ Use S3 lifecycle policies  
✅ Destroy resources when not in use  
✅ Monitor costs with AWS Cost Explorer  
 
- High Availability

✅ Deploy across multiple AZs  
✅ Use RDS Multi-AZ for production  
✅ Configure HPA for auto-scaling  
✅ Implement health checks and readiness probes  
✅ Use ELB for load distribution  

- Monitoring

✅ Set up CloudWatch alarms  
✅ Configure Prometheus alerts  
✅ Enable logging to CloudWatch Logs  
✅ Use distributed tracing in production  
✅ Regular review of dashboards  
 
---

## 📞 Support

- If you encounter issues during deployment:
- Check Logs
```
   kubectl logs -n durga-puja deployment/backend
   terraform show
```
- Review Documentation
	- Terraform AWS Provider
	- EKS Best Practices
	- Kubernetes Documentation

---

## Common Issues

- See TROUBLESHOOTING.md
- Check GitHub Issues

---

## Get Help

- Open an issue on GitHub
- Contact: shubhadeep010@gmail.com

---

🎉 Deployment Complete!  
If you successfully deployed the platform, give it a ⭐️!  
Next Steps:  

- Take screenshots for documentation
- Configure monitoring alerts
- Set up backup strategies
- Plan production deployment

Made with ❤️ by Shubhadeep
<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="400">


