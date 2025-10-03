# Environment Variables Configuration

**Issue ID**: ENV-001, ENV-002  
**Date**: September 21-23, 2024  
**Severity**: MEDIUM  
**Status**: ✅ RESOLVED

---

## Issues Encountered

### Vercel Deployment - Missing API URL
- Error: Environment Variable "VITE_API_URL" references Secret "vite_api_url",which does not exist.  

### Railway Deployment - Missing Configuration
- Application not found (404)
- Service initializing indefinitely
- Health check failing

## Root Cause Analysis

### Issue 1: Vercel Configuration Error
- `vercel.json` file referenced non-existent secrets:
```json
{
  "env": {
    "VITE_API_URL": "@vite_api_url"  // Secret didn't exist
  }
}
```

### Issue 2: Railway Missing Variables
- Backend application expecting:

NODE_ENV  
PORT  
MONGODB_URI  

- Without these variables, the application couldn't start.

## Solutions Implemented

#### Vercel Environment Setup
- Method 1: Remove vercel.json (Immediate Fix)
```
cd frontend
rm vercel.json
vercel --prod
```
#### Let Vercel auto-detect configuration
- Method 2: Set Environment Variables in Dashboard
- Navigate to: vercel.com → Project → Settings → Environment Variables
- Add:
VITE_API_URL = https://durga-puja-backend.onrender.com   
- Apply to: Production, Preview, Development

#### Railway Environment Setup
- Navigate to: railway.app → Project → Variables
- Add:
NODE_ENV = production  
PORT = 5000  
MONGODB_URI = mongodb+srv://shubhadeep010_db:RAJABAAJA66@durga-puja-cluster...  
- Click: Deploy (to restart with new variables)

#### Render Environment Setup
- During service creation, add Environment Variables:

NODE_ENV = production  
PORT = 10000  
MONGODB_URI = mongodb+srv://shubhadeep010_db:RAJABAAJA66@durga-puja-cluster...

- Environment Variable Management Strategy
- Development (.env.local)

##### frontend/.env.local
VITE_API_URL=http://localhost:5000

##### backend/.env

NODE_ENV=development  
PORT=5000   
MONGODB_URI=mongodb://localhost:27017/durga-puja  
REDIS_URL=redis://localhost:6379  
Production (Platform Secrets)   

##### Vercel
VITE_API_URL=https://durga-puja-backend.onrender.com   

##### Render/Railway
NODE_ENV=production  
PORT=5000 (Railway) or 10000 (Render)   
MONGODB_URI=mongodb+srv://... (Atlas production)   
CI/CD (GitHub Secrets)  

### GitHub Repository Secrets
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
- STAGING_API_URL
- PRODUCTION_API_URL
- MONGODB_URI_STAGING
- MONGODB_URI_PRODUCTION

## Security Best Practices
- What NOT to Commit
```
.gitignore
.env
.env.local
.env.production
.env.*.local
.vercel
```

## Secret Management

- Use platform-specific secret management
- Rotate credentials regularly
- Never commit sensitive data
- Use different credentials per environment

## Access Control
Production Secrets:  
  - Restricted to deployment processes only
  - Admin access only
  - Audit logging enabled

Development Secrets:  
  - Team-wide access
  - Non-sensitive data
  - Can be regenerated easily

