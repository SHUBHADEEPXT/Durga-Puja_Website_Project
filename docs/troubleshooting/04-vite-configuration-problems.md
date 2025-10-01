# Vite Configuration and Build Issues

**Issue ID**: VITE-001  
**Date**: September 21, 2024  
**Severity**: HIGH  
**Status**: ✅ RESOLVED

## Problem Description

Vercel deployment failing with error:  

- RollupError: Could not resolve entry module "index.html"
- error during build: Could not resolve entry module "index.html"

### Environment
- Build Platform: Vercel
- Framework: Vite v4.5.14
- Build Command: `npm run build`

## Investigation Process

### Initial State
```bash
# Directory structure discovered
frontend/
├── public/
│   └── index.html  # File location
├── src/
│   └── main.jsx
└── package.json
```

### Root Cause

- Vite expects index.html in the project root directory, not in public/ folder. This is different from Create React App conventions.

### Solution

- File Relocation
```
cd frontend
mv public/index.html ./
```

### Verify Structure
```
frontend/
├── index.html          # Correct location (root)
├── public/             # For static assets only
├── src/
└── vite.config.js
```

### Result
```
vercel --prod
```
# ✅ Production: https://durga-puja-frontend-mg7a240p3-shubhadeepxts-projects.vercel.app
# Build succeeded

## Impact on Other Issues

- This file location issue was potentially contributing to the WSL2 Docker networking problem:
	- Local Vite dev server couldn't find entry point correctly
	- 404 errors on localhost:3000 were partially due to incorrect file structure
	- Moving index.html to root may resolve both build and local development issues

