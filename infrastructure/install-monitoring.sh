#!/bin/bash

# Add Prometheus Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus + Grafana stack
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --values prometheus-values.yaml \
  --wait

echo "✅ Monitoring stack installed!"
echo "📊 Access Grafana: kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80"
echo "🔐 Default credentials: admin / changeme"
