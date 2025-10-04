# CI/CD Pipeline Documentation

## Workflows

### 1. Production CI/CD Pipeline (`cicd-pipeline.yaml`)
Main pipeline that runs on every push and PR.

**Stages:**
- **Frontend**: Test → Security Scan → Docker Build
- **Backend**: Test → Security Scan → Docker Build
- **Infrastructure**: Terraform Validation → Kubernetes Validation
- **Deployment**: Manual trigger with `[deploy]` in commit message

**Usage:**
```bash
# Regular commit (runs tests only)
git commit -m "fix: update frontend component"

# Deploy to AWS (runs full pipeline + deployment)
git commit -m "[deploy] feat: new feature ready for production"
2. Terraform Plan Preview (terraform-plan.yaml)
Runs on PRs that change Terraform files. Posts plan preview as PR comment.
3. Cost Monitor (cost-monitor.yaml)
Runs daily to track AWS spending. View in Actions summary.
Required Secrets
Configure these in GitHub Settings → Secrets:
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
MONGODB_PASSWORD
REDIS_PASSWORD
VITE_API_URL
Interview Talking Points
✅ Multi-stage pipeline with quality gates
✅ Security scanning integrated
✅ Infrastructure as Code validation
✅ GitOps workflow with manual deployment gate
✅ Cost monitoring automation
✅ Artifact management for Docker images
✅ Environment-specific deployments
