# Docker Image Build Failures

**Issue ID**: DOCKER-001  
**Date**: September 23-28, 2025  
**Severity**: HIGH  
**Status**: ✅ RESOLVED

---

## Problem Description

Docker image build and push failures during CI/CD pipeline execution:

```
Error: invalid tag "ghcr.io/SHUBHADEEPXT/durga-puja-platform-frontend:..."
repository name must be lowercase

Error: failed to solve: failed to push image
denied: permission denied

Error: context canceled
building image for multiple platforms failed
```

**Screenshot Evidence**: 
- #41: Build Container Images failure in GitHub Actions
- #48: Repository name must be lowercase error
- #82: Final successful pipeline after fixes

---

## Root Cause Analysis

### Issue 1: Uppercase Repository Name

**Problem**: Docker registry enforces strict naming convention - all lowercase
- GitHub username: `SHUBHADEEPXT` (uppercase)
- Image name: `ghcr.io/SHUBHADEEPXT/...` ❌

### Issue 2: Multi-Platform Build Overhead

**Problem**: Building for multiple platforms (linux/amd64, linux/arm64) on GitHub free tier
- Takes 2x-3x longer
- Higher resource consumption
- Timeout issues

### Issue 3: Registry Authentication

**Problem**: Missing or expired Docker Hub credentials in GitHub Secrets

---

## Solutions

### Fix 1: Convert Repository Name to Lowercase

#### Before (Failing):
```yaml
# .github/workflows/production-cicd.yml
env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository_owner }}/durga-puja-platform

jobs:
  build:
    steps:
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:${{ github.sha }}
          # Results in: ghcr.io/SHUBHADEEPXT/... ❌ UPPERCASE
```

#### After (Fixed):
```yaml
# .github/workflows/production-cicd.yml
env:
  REGISTRY: ghcr.io

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      # CRITICAL FIX: Convert to lowercase
      - name: Convert repository names to lowercase
        id: lowercase
        run: |
          echo "repo_owner=$(echo ${{ github.repository_owner }} | tr '[:upper:]' '[:lower:]')" >> $GITHUB_OUTPUT
          echo "repo_name=$(echo ${{ github.repository }} | tr '[:upper:]' '[:lower:]')" >> $GITHUB_OUTPUT

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push frontend image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          file: ./frontend/Dockerfile
          platforms: linux/amd64  # Single platform for speed
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/durga-puja-platform-frontend:${{ github.sha }}
            ${{ secrets.DOCKER_USERNAME }}/durga-puja-platform-frontend:latest
          cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/durga-puja-platform-frontend:buildcache
          cache-to: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/durga-puja-platform-frontend:buildcache,mode=max

      - name: Build and push backend image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile
          platforms: linux/amd64
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/durga-puja-platform-backend:${{ github.sha }}
            ${{ secrets.DOCKER_USERNAME }}/durga-puja-platform-backend:latest
          cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/durga-puja-platform-backend:buildcache
          cache-to: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/durga-puja-platform-backend:buildcache,mode=max
```

### Fix 2: Optimize Platform Build

#### Multi-Platform (Slow):
```yaml
platforms: linux/amd64,linux/arm64  # Takes 2-3x longer
```

#### Single Platform (Fast):
```yaml
platforms: linux/amd64  # Optimized for x86_64 (most common)
```

### Fix 3: Configure Docker Registry Authentication

#### Set GitHub Secrets:
```bash
# In GitHub repository: Settings > Secrets and variables > Actions

# Add these secrets:
DOCKER_USERNAME: difindoxt
DOCKER_PASSWORD: <your-docker-hub-token>

# Or for GitHub Container Registry:
GHCR_TOKEN: <your-github-token>
```

#### Update Workflow:
```yaml
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

# Or for GHCR:
- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

---

## Dockerfile Optimization

### Frontend Dockerfile:
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile:
```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src

# Expose port
EXPOSE 5000

# Run application
CMD ["node", "src/server.js"]
```

---

## Build Testing

### Local Testing:
```bash
# Test frontend build
cd frontend
docker build -t durga-puja-frontend:test .
docker run -p 3000:80 durga-puja-frontend:test

# Test backend build
cd backend
docker build -t durga-puja-backend:test .
docker run -p 5000:5000 -e NODE_ENV=production durga-puja-backend:test

# Test with Docker Compose
docker-compose up --build
```

### Build Performance Optimization:
```dockerfile
# Use build cache
RUN --mount=type=cache,target=/root/.npm npm ci

# Use multi-stage builds
FROM node:18-alpine AS deps
FROM node:18-alpine AS builder
FROM node:18-alpine AS runner

# Minimize layers
RUN apk add --no-cache \
    python3 \
    make \
    g++
```

---

## Verification

### Check Image on Docker Hub:
```bash
# Pull and verify images
docker pull difindoxt/durga-puja-platform-frontend:latest
docker pull difindoxt/durga-puja-platform-backend:latest

# Inspect images
docker image inspect difindoxt/durga-puja-platform-frontend:latest
docker image inspect difindoxt/durga-puja-platform-backend:latest

# Check image size
docker images | grep durga-puja
```

### Test in Kubernetes:
```bash
# Update deployment with new image
kubectl set image deployment/frontend \
  frontend=difindoxt/durga-puja-platform-frontend:latest \
  -n durga-puja

kubectl set image deployment/backend \
  backend=difindoxt/durga-puja-platform-backend:latest \
  -n durga-puja

# Check rollout status
kubectl rollout status deployment/frontend -n durga-puja
kubectl rollout status deployment/backend -n durga-puja
```

---

## Best Practices

✅ Always use lowercase for image names
✅ Use multi-stage builds to reduce image size
✅ Implement layer caching for faster builds
✅ Tag images with both SHA and latest
✅ Use .dockerignore to exclude unnecessary files
✅ Test builds locally before pushing
✅ Monitor build times and optimize
✅ Use specific base image versions (not :latest)

❌ Don't use uppercase in image names
❌ Don't build for multiple platforms unless necessary
❌ Don't include development dependencies in production
❌ Don't store secrets in Docker images
❌ Don't use :latest tag in production

---

## Related Issues

- [CI/CD Pipeline Errors](06-cicd-pipeline-errors.md)
- [Docker Registry Issues](15-docker-registry-issues.md)
- [Environment Variables](07-environment-variables.md)

---

**Last Updated**: October 28, 2025  
**Screenshot References**: #41, #48, #82
