#!/bin/bash

set -e

echo "🗑️  Durga Puja Platform - Teardown Script"
echo "=========================================="

read -p "⚠️  This will destroy ALL resources. Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Teardown cancelled"
    exit 0
fi

echo "🗑️  Deleting Kubernetes resources..."
cd infrastructure/kubernetes
kubectl delete -f ingress/ || true
kubectl delete -f services/ || true
kubectl delete -f deployments/ || true
kubectl delete namespace durga-puja || true
kubectl delete namespace monitoring || true
kubectl delete namespace argocd || true

echo "🗑️  Destroying Terraform infrastructure..."
cd ../terraform
terraform destroy -auto-approve

echo "✅ All resources destroyed!"
echo "💰 Your AWS bill is safe now 😊"
