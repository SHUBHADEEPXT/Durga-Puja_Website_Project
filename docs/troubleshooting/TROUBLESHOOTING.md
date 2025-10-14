<div align="center">

# 🔧 Troubleshooting Guide

### Complete Guide to Common Issues and Solutions

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="600">

[![Issues](https://img.shields.io/github/issues/SHUBHADEEPXT/Durga-Puja_Website_Project?style=flat-square)](https://github.com/SHUBHADEEPXT/Durga-Puja_Website_Project/issues)
[![Resolved](https://img.shields.io/badge/Resolved-95%25-success?style=flat-square)](https://github.com/SHUBHADEEPXT/Durga-Puja_Website_Project)

[🐛 Quick Fixes](#-quick-fixes) • [📚 All Issues](#-all-troubleshooting-guides) • [💡 Debug Tips](#-debugging-tips) • [📞 Get Help](#-get-help)

</div>

---

## 📋 Table of Contents

- [Quick Fixes](#-quick-fixes)
- [All Troubleshooting Guides](#-all-troubleshooting-guides)
  - [Development Issues](#-development-issues)
  - [Infrastructure Issues](#️-infrastructure-issues)
  - [Deployment Issues](#-deployment-issues)
  - [Kubernetes Issues](#️-kubernetes-issues)
  - [Monitoring Issues](#-monitoring-issues)
- [Debugging Tips](#-debugging-tips)
- [Common Error Messages](#-common-error-messages)
- [Get Help](#-get-help)

---

## ⚡ Quick Fixes

### Most Common Issues (90% of Problems)

<table>
<tr>
<td width="50%">

#### 🔴 Pod Not Starting
```bash
# Check pod status
kubectl describe pod <pod-name> -n durga-puja

# Common fixes:
# 1. Wrong image name
kubectl set image deployment/backend \
  backend=difindoxt/durga-puja-backend:latest \
  -n durga-puja

# 2. Insufficient resources
kubectl top nodes

# 3. Pull secrets missing
kubectl create secret docker-registry regcred \
  --docker-server=docker.io \
  --docker-username=<username> \
  --docker-password=<password>
```

</td>
<td width="50%">

#### 🔴 Terraform Apply Failed
```bash
# 1. State lock issue
terraform force-unlock <LOCK_ID>

# 2. Resource already exists
terraform import <resource> <id>

# 3. Insufficient permissions
aws sts get-caller-identity

# 4. Region mismatch
export AWS_DEFAULT_REGION=us-east-1
terraform plan
```

</td>
</tr>
<tr>
<td width="50%">

#### 🔴 Can't Access Application
```bash
# 1. Get Load Balancer URL
kubectl get ingress -n durga-puja

# 2. Check if pods are ready
kubectl get pods -n durga-puja

# 3. Check service
kubectl get svc -n durga-puja

# 4. Check Load Balancer health
aws elbv2 describe-target-health \
  --target-group-arn <ARN>
```

</td>
<td width="50%">

#### 🔴 Pipeline Failing
```bash
# 1. Check GitHub Actions logs
# Go to: Actions tab → Failed workflow

# 2. Common fixes:
# - Update Docker Hub credentials
# - Check AWS credentials
# - Verify image names in manifests

# 3. Re-run workflow
# Click "Re-run all jobs" in GitHub Actions
```

</td>
</tr>
</table>

---

## 📚 All Troubleshooting Guides

### 🖥️ Development Issues

<table>
<tr>
<th>Issue</th>
<th>Guide</th>
<th>Severity</th>
<th>Time to Fix</th>
</tr>

<tr>
<td>WSL2 Docker Networking</td>
<td><a href="troubleshooting/01-wsl2-docker-networking.md">📖 Guide</a></td>
<td>🟡 Medium</td>
<td>15 min</td>
</tr>

<tr>
<td>NPM Permission Errors</td>
<td><a href="troubleshooting/03-npm-permissions-errors.md">📖 Guide</a></td>
<td>🟡 Medium</td>
<td>10 min</td>
</tr>

<tr>
<td>Vite Configuration Problems</td>
<td><a href="troubleshooting/04-vite-configuration-problems.md">📖 Guide</a></td>
<td>🟢 Low</td>
<td>5 min</td>
</tr>

<tr>
<td>MongoDB Connection Setup</td>
<td><a href="troubleshooting/05-mongodb-connection-setup.md">📖 Guide</a></td>
<td>🟡 Medium</td>
<td>20 min</td>
</tr>

<tr>
<td>Environment Variables</td>
<td><a href="troubleshooting/07-environment-variables.md">📖 Guide</a></td>
<td>🟢 Low</td>
<td>10 min</td>
</tr>
</table>

---

### 🏗️ Infrastructure Issues

<table>
<tr>
<th>Issue</th>
<th>Guide</th>
<th>Severity</th>
<th>Time to Fix</th>
</tr>

<tr>
<td>Terraform State Lock</td>
<td><a href="troubleshooting/08-terraform-state-lock.md">📖 Guide</a></td>
<td>🔴 High</td>
<td>5 min</td>
</tr>

<tr>
<td>AWS Resource Limits</td>
<td><a href="troubleshooting/09-aws-resource-limits.md">📖 Guide</a></td>
<td>🔴 High</td>
<td>30 min</td>
</tr>

<tr>
<td>VPC Configuration Errors</td>
<td><a href="troubleshooting/10-vpc-configuration.md">📖 Guide</a></td>
<td>🟡 Medium</td>
<td>20 min</td>
</tr>

<tr>
<td>RDS Connection Issues</td>
<td><a href="troubleshooting/11-rds-connection.md">📖 Guide</a></td>
<td>🔴 High</td>
<td>15 min</td>
</tr>

<tr>
<td>ElastiCache Redis Issues</td>
<td><a href="troubleshooting/12-elasticache-redis.md">📖 Guide</a></td>
<td>🟡 Medium</td>
<td>15 min</td>
</tr>

<tr>
<td>Terraform Destroy Blocked</td>
<td><a href="troubleshooting/13-terraform-destroy-blocked.md">📖 Guide</a></td>
<td>🔴 High</td>
<td>15 min</td>
</tr>
</table>

---

### 🚀 Deployment Issues

<table>
<tr>
<th>Issue</th>
<th>Guide</th>
<th>Severity</th>
<th>Time to Fix</th>
</tr>

<tr>
<td>Deployment Platform Failures</td>
<td><a href="troubleshooting/02-deployment-platform-failures.md">📖 Guide</a></td>
<td>🔴 High</td>
<td>30 min</td>
</tr>

<tr>
<td>CI/CD Pipeline Errors</td>
<td><a href="troubleshooting/06-cicd-pipeline-errors.md">📖 Guide</a></td>
<td>🔴 High</td>
<td>20 min</td>
</tr>

<tr>
<td>Docker Image Build Failures</td>
<td><a href="troubleshooting/14-docker-build-failures.md">📖 Guide</a></td>
<td>🟡 Medium</td>
<td>15 min</td>
</tr>

<tr>
<td>Docker Registry Issues</td>
<td><a href="troubleshooting/15-docker-registry-issues.md">📖 Guide</a></td>
<td>🟡 Medium</td>
<td>10 min</td>
</tr>
</table>

---

### ☸️ Kubernetes Issues

<table>
<tr>
<th>Issue</th>
<th>Guide</th>
<th>Severity</th>
<th>Time to Fix</th>
</tr>

<tr>
<td>EKS Cluster Not Accessible</td>
<td><a href="troubleshooting/16-eks-cluster-access.md">📖 Guide</a></td>
<td>🔴 High</td>
<td>10 min</td>
</tr>

<tr>
<td>Pod ImagePullBackOff</td>
<td><a href="troubleshooting/17-imagepullbackoff.md">📖 Guide</a></td>
<td>🔴 High</td>
<td>10 min</td>
</tr>

<tr>
<td>Pod CrashLoopBackOff</td>
<td><a href="troubleshooting/18-crashloopbackoff.md">📖 Guide</a></td>
<td>🔴 High</td>
<td>20 min</td>
</tr>

<tr>
<td>Service Not Accessible</td>
<td><a href="troubleshooting/19-service-not-accessible.md">📖 Guide</a></td>
<td>🟡 Medium</td>
<td>15 min</td>
</tr>

<tr>
<td>Ingress No Address</td>
<td><a href="troubleshooting/20-ingress-no-address.md">📖 Guide</a></td>
<td>🔴 High</td>
<td>15 min</td>
</tr>

<tr>
<td>HPA Not Scaling</td>
<td><a href="troubleshooting/21-hpa-not-scaling.md">📖 Guide</a></td>
<td>🟡 Medium</td>
<td>20 min</td>
</tr>

<tr>
<td>ConfigMap/Secret Issues</td>
<td><a href="troubleshooting/22-configmap-secret-issues.md">📖 Guide</a></td>
<td>🟡 Medium</td>
<td>10 min</td>
</tr>
</table>

---

### 📊 Monitoring Issues

<table>
<tr>
<th>Issue</th>
<th>Guide</th>
<th>Severity</th>
<th>Time to Fix</th>
</tr>

<tr>
<td>Prometheus Not Collecting Metrics</td>
<td><a href="troubleshooting/23-prometheus-metrics.md">📖 Guide</a></td>
<td>🟡 Medium</td>
<td>15 min</td>
</tr>

<tr>
<td>Grafana Dashboard Empty</td>
<td><a href="troubleshooting/24-grafana-dashboard.md">📖 Guide</a></td>
<td>🟢 Low</td>
<td>10 min</td>
</tr>

<tr>
<td>ArgoCD Sync Failed</td>
<td><a href="troubleshooting/25-argocd-sync.md">📖 Guide</a></td>
<td>🔴 High</td>
<td>15 min</td>
</tr>
</table>

---

## 💡 Debugging Tips

### General Debugging Workflow
```
1. Identify the Layer
   ├─ Infrastructure (AWS/Terraform)
   ├─ Kubernetes (Pods/Services)
   ├─ Application (Frontend/Backend)
   └─ Network (Load Balancer/DNS)

2. Check Logs
   ├─ Kubernetes: kubectl logs
   ├─ AWS: CloudWatch Logs
   ├─ Application: stdout/stderr
   └─ CI/CD: GitHub Actions logs

3. Verify Configuration
   ├─ Environment variables
   ├─ Secrets
   ├─ Network policies
   └─ Resource limits

4. Test Connectivity
   ├─ Pod to pod
   ├─ Pod to service
   ├─ Service to external
   └─ Load balancer to pods
```

### Essential Commands

#### Kubernetes Debugging
```bash
# Get all resources in namespace
kubectl get all -n durga-puja

# Describe resource (shows events)
kubectl describe pod <pod-name> -n durga-puja
kubectl describe svc <service-name> -n durga-puja
kubectl describe ingress <ingress-name> -n durga-puja

# Check logs
kubectl logs <pod-name> -n durga-puja
kubectl logs <pod-name> -n durga-puja --previous  # Previous container

# Follow logs in real-time
kubectl logs -f <pod-name> -n durga-puja

# Execute commands in pod
kubectl exec -it <pod-name> -n durga-puja -- /bin/sh

# Check resource usage
kubectl top nodes
kubectl top pods -n durga-puja

# Check events
kubectl get events -n durga-puja --sort-by='.lastTimestamp'

# Port forward for testing
kubectl port-forward pod/<pod-name> 8080:8080 -n durga-puja
```

#### AWS/Terraform Debugging
```bash
# Check AWS credentials
aws sts get-caller-identity

# Terraform debugging
export TF_LOG=DEBUG
terraform plan

# Check Terraform state
terraform show
terraform state list

# Terraform console (interactive)
terraform console

# Validate configuration
terraform validate
terraform fmt -check -recursive
```

#### Docker Debugging
```bash
# List images
docker images

# Check image layers
docker history <image-name>

# Run container interactively
docker run -it <image-name> /bin/sh

# Check logs
docker logs <container-id>

# Inspect container
docker inspect <container-id>

# Check running containers
docker ps -a
```

---

## 🚨 Common Error Messages

### Error: ImagePullBackOff
```
Error: Failed to pull image "difindoxt/durga-puja-backend:latest"
```

**Causes:**
1. Image doesn't exist in registry
2. Wrong image name/tag
3. Private registry without credentials

**Solutions:**
→ See [ImagePullBackOff Guide](troubleshooting/17-imagepullbackoff.md)

---

### Error: CrashLoopBackOff
```
Error: Back-off restarting failed container
```

**Causes:**
1. Application crashes on startup
2. Missing environment variables
3. Database connection failed
4. Port already in use

**Solutions:**
→ See [CrashLoopBackOff Guide](troubleshooting/18-crashloopbackoff.md)

---

### Error: Terraform State Lock
```
Error: Error acquiring the state lock
Lock Info:
  ID:        xxxxx-xxxx-xxxx-xxxx
  Path:      terraform.tfstate
  Operation: OperationTypeApply
  Who:       user@hostname
```

**Quick Fix:**
```bash
terraform force-unlock <LOCK_ID>
```

**Solutions:**
→ See [Terraform State Lock Guide](troubleshooting/08-terraform-state-lock.md)

---

### Error: DependencyViolation
```
Error: deleting EC2 Subnet: DependencyViolation: 
The subnet has dependencies and cannot be deleted
```

**Causes:**
1. Load Balancers still attached
2. Network Interfaces in use
3. EKS resources not cleaned up

**Solutions:**
→ See [Terraform Destroy Blocked Guide](troubleshooting/13-terraform-destroy-blocked.md)

---

### Error: Insufficient Permissions
```
Error: UnauthorizedOperation: You are not authorized 
to perform this operation
```

**Quick Fix:**
```bash
# Check current user
aws sts get-caller-identity

# Verify IAM permissions
aws iam get-user-policy --user-name <username> --policy-name <policy>
```

**Solutions:**
→ See [AWS Resource Limits Guide](troubleshooting/09-aws-resource-limits.md)

---

## 🔍 Debugging Checklist

Use this checklist when troubleshooting:

### Infrastructure Issues
- [ ] AWS credentials configured correctly
- [ ] Correct AWS region selected
- [ ] IAM permissions sufficient
- [ ] Terraform state not locked
- [ ] No conflicting resources
- [ ] Service quotas not exceeded

### Kubernetes Issues
- [ ] kubectl configured for correct cluster
- [ ] Namespace exists
- [ ] Pods are running
- [ ] Services are created
- [ ] Ingress has address
- [ ] Load balancer is healthy

### Application Issues
- [ ] Environment variables set
- [ ] Secrets mounted correctly
- [ ] Database accessible
- [ ] Cache (Redis) accessible
- [ ] Application logs checked
- [ ] Health checks passing

### Network Issues
- [ ] Security groups allow traffic
- [ ] Network ACLs configured
- [ ] DNS resolving correctly
- [ ] Load balancer target healthy
- [ ] Ingress rules correct
- [ ] Service selectors match pods

---

## 📖 How to Use These Guides

### 1. Identify Your Issue

Look at the error message or symptom and find the matching guide above.

### 2. Follow the Guide

Each guide contains:
- **Symptoms**: How to recognize the issue
- **Root Cause**: Why it happens
- **Solution**: Step-by-step fix
- **Prevention**: How to avoid it

### 3. Still Stuck?

If the guide doesn't solve your problem:
1. Check the debugging tips section
2. Search existing [GitHub Issues](https://github.com/SHUBHADEEPXT/Durga-Puja_Website_Project/issues)
3. Open a new issue with details
4. Join our community discussions

---

## 📞 Get Help

### Before Asking for Help

Gather this information:
```
# 1. Environment details
kubectl version --client
terraform version
aws --version

# 2. Resource status
kubectl get all -n durga-puja
kubectl get events -n durga-puja

# 3. Logs
kubectl logs <pod-name> -n durga-puja > logs.txt

# 4. Error messages
# Copy the complete error message
```

### Where to Get Help

<table>
<tr>
<td width="50%">

**GitHub Issues**
- Search existing issues first
- Include all debug information
- Attach relevant logs
- Describe steps to reproduce

[Open an Issue →](https://github.com/SHUBHADEEPXT/Durga-Puja_Website_Project/issues/new)

</td>
<td width="50%">

**Community Support**
- Stack Overflow (tag: durga-puja-devops)
- GitHub Discussions
- LinkedIn (DM the author)
- Email: your.email@example.com

</td>
</tr>
</table>

---

## 🎓 Learning Resources

### Understanding Error Messages

- [Kubernetes Troubleshooting Guide](https://kubernetes.io/docs/tasks/debug/)
- [AWS Troubleshooting Documentation](https://docs.aws.amazon.com/troubleshooting/)
- [Terraform Debugging](https://developer.hashicorp.com/terraform/internals/debugging)

### Best Practices

- Always check logs first
- Use `kubectl describe` to see events
- Enable debug logging when needed
- Keep documentation updated
- Test changes in dev environment first

---

## 🤝 Contributing

Found a solution to a problem not listed here?

1. Fork the repository
2. Add your troubleshooting guide
3. Follow the template format
4. Submit a pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

<div align="center">

### 💡 Pro Tips
```
✅ Read error messages carefully - they usually tell you what's wrong
✅ Check logs before asking for help
✅ Google error messages - someone likely had the same issue
✅ Document your solutions for future reference
✅ Verify one thing at a time when debugging
```

**Made with ❤️ by [Shubhadeep](https://github.com/SHUBHADEEPXT)**

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="400">

*Remember: Every error is a learning opportunity!*

</div>
