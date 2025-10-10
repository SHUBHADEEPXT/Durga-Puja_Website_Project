#!/bin/bash

set -e

echo "🚀 Complete Deployment Script"
echo "=============================="

# Step 1: Configure kubectl
echo ""
echo "Step 1: Configuring kubectl..."
aws eks update-kubeconfig --region us-east-1 --name durga-puja-eks
kubectl get nodes

# Step 2: Update secrets with real endpoints
echo ""
echo "Step 2: Updating secrets..."
./update-secrets.sh

# Step 3: Deploy application
echo ""
echo "Step 3: Deploying application..."
./deploy-app.sh

# Step 4: Install monitoring
echo ""
echo "Step 4: Installing monitoring..."
./install-monitoring.sh

# Step 5: Install ArgoCD
echo ""
echo "Step 5: Installing ArgoCD..."
./install-argocd.sh

echo ""
echo "=============================="
echo "🎉 COMPLETE DEPLOYMENT DONE!"
echo "=============================="
echo ""
echo "📱 Next Steps:"
echo "1. Get Load Balancer URL: kubectl get ingress -n durga-puja"
echo "2. Access Grafana: kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80"
echo "3. Access ArgoCD: kubectl port-forward -n argocd svc/argocd-server 8080:443"
