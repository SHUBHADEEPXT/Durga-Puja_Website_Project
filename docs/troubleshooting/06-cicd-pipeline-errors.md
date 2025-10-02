# CI/CD Pipeline Configuration and Errors

**Issue ID**: CICD-001  
**Date**: September 23, 2024  
**Severity**: HIGH  
**Status**: ✅ RESOLVED

---

## Problem Description

- GitHub Actions workflow failing during Docker image build phase:
- ERROR: invalid tag "ghcr.io/SHUBHADEEPXT/Durga-Puja_Website_Project-frontend:..." --- repository name must be lowercase

---

## Root Cause Analysis

### Docker Registry Naming Convention
Docker container registries enforce strict naming rules:  
- All characters must be lowercase
- No uppercase letters allowed in repository names

### Issue Source

#### GitHub Actions workflow

```env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository_owner }}/durga-puja-platform
```
#### Problem: repository_owner = "SHUBHADEEPXT" (uppercase)
- Investigation Process
- Error Evidence
- ERROR: failed to build: invalid tag 
	- "ghcr.io/SHUBHADEEPXT/Durga-Puja_Website_Project-frontend:ec3f1b48..."
	- repository name must be lowercase

### Validation Steps
- Checked Docker registry documentation
- Verified GitHub Actions variables
- Tested lowercase conversion methods
- Validated solution in pipeline

### Solution Implementation
- Lowercase Conversion in Workflow
- .github/workflows/production-cicd.yml

- name: Convert repository name to lowercase
  id: lowercase
  run: |
    echo "repo_owner=$(echo ${{ github.repository_owner }} | tr '[:upper:]' '[:lower:]')" >> $GITHUB_OUTPUT
    echo "repo_name=$(echo ${{ github.repository }} | tr '[:upper:]' '[:lower:]')" >> $GITHUB_OUTPUT

- name: Build and push frontend image
  uses: docker/build-push-action@v5
  with:
    context: ./frontend
    platforms: linux/amd64
    push: true
    tags: |
      ${{ env.REGISTRY }}/${{ steps.lowercase.outputs.repo_owner }}/durga-puja-platform-frontend:${{ github.sha }}
      ${{ env.REGISTRY }}/${{ steps.lowercase.outputs.repo_owner }}/durga-puja-platform-frontend:latest

### Additional Fixes Applied
- Dependency Installation Issues
- Fixed: Separated frontend and backend installations

- name: Install dependencies - Frontend
  run: cd frontend && npm ci

- name: Install dependencies - Backend
  run: cd backend && npm ci

### ESLint Path Correction

- Changed backend ESLint path
- name: ESLint Analysis - Backend
  run: |
    cd backend
    npx eslint . --format=json --output-file=eslint-report.json || true
  # Changed from: eslint src/ (incorrect)
  # Changed to: eslint . (correct)

### Error Handling Enhancement

- Added continue-on-error for non-critical steps
- name: ESLint Analysis - Frontend
  run: |
    cd frontend
    npx eslint src/ --format=json --output-file=eslint-report.json || true
  continue-on-error: true

### Platform Differences
- Multi-Platform Builds
- Initial attempt (too complex for free tier) --- platforms: linux/amd64,linux/arm64

#### Optimized for free tier
- platforms: linux/amd64  # Single platform for faster builds
- MongoDB Service Addition
- Added for backend testing
```
services:
  mongodb:
    image: mongo:6.0
    ports:
      - 27017:27017
```

### Verification Process
- Build Success Indicators
- After fixes applied

✅ Code Quality Analysis - Passed
✅ Security Vulnerability Scan - Passed  
✅ Frontend Build & Test - Passed
✅ Backend Build & Test - Passed
✅ Build Container Images - Passed


### Testing Strategy
- Incremental Fixes: Applied one fix at a time
- Pipeline Monitoring: Watched each job execution
- Log Analysis: Reviewed error messages for each failure
- Iterative Improvement: Committed fixes progressively
