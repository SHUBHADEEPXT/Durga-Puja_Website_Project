#!/bin/bash

set -e

echo "🚀 Durga Puja Platform - AWS Deployment Script"
echo "================================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"
command -v terraform >/dev/null 2>&1 || { echo "❌ Terraform not found. Install it first."; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo "❌ kubectl not found. Install it first."; exit 1; }
command -v helm >/dev/null 2>&1 || { echo "❌ Helm not found. Install it first."; exit 1; }
command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI not found. Install it first."; exit 1; }

echo -e "${GREEN}✅ All prerequisites met${NC}\n"

# Step 1: Deploy Infrastructure
echo -e "${BLUE}Step 1: Deploying AWS Infrastructure with Terraform${NC}"
cd infrastructure/terraform

terraform init
terraform plan -out=tfplan
terraform apply tfplan

echo -e "${GREEN}✅ Infrastructure deployed${NC}\n"

# Step 2: Configure kubectl
echo -e "${BLUE}Step 2: Configuring kubectl${NC}"
aws eks update-kubeconfig --region us-east-1 --name durga-puja-eks

kubectl get nodes
echo -e "${GREEN}✅ kubectl configured${NC}\n"

# Step 3: Install AWS Load Balancer Controller
echo -e "${BLUE}Step 3: Installing AWS Load Balancer Controller${NC}"
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=durga-puja-eks \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

echo -e "${GREEN}✅ Load Balancer Controller installed${NC}\n"

# Step 4: Deploy Applications
echo -e "${BLUE}Step 4: Deploying Applications${NC}"
cd ../kubernetes

kubectl apply -f namespaces/
kubectl apply -f configmaps/
kubectl apply -f secrets/
kubectl apply -f deployments/
kubectl apply -f services/
kubectl apply -f ingress/

echo -e "${GREEN}✅ Applications deployed${NC}\n"

# Step 5: Install ArgoCD
echo -e "${BLUE}Step 5: Installing ArgoCD${NC}"
kubectl create namespace argocd || true
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

kubectl wait --for=condition=Ready pods --all -n argocd --timeout=300s

echo -e "${GREEN}✅ ArgoCD installed${NC}\n"

# Step 6: Install Monitoring
echo -e "${BLUE}Step 6: Installing Monitoring Stack${NC}"
cd monitoring
./install-monitoring.sh

echo -e "${GREEN}✅ Monitoring stack installed${NC}\n"

# Get Load Balancer URL
echo -e "${YELLOW}⏳ Waiting for Load Balancer to be ready...${NC}"
sleep 60

LB_URL=$(kubectl get ingress durga-puja-ingress -n durga-puja -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

echo ""
echo "================================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "================================================"
echo ""
echo "📱 Application URL: http://$LB_URL"
echo "🔐 ArgoCD URL: kubectl port-forward svc/argocd-server -n argocd 8080:443"
echo "📊 Grafana URL: kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80"
echo ""
echo "🔑 Get ArgoCD password: kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d"
echo ""
echo "💰 Estimated daily cost: ₹150-250"
echo "⚠️  Remember to run './destroy.sh' when done!"
