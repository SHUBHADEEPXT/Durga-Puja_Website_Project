# NPM Global Permissions Error (WSL2)

**Issue ID**: NPM-001  
**Date**: September 21, 2024  
**Severity**: MEDIUM  
**Status**: ✅ RESOLVED

## Problem
```bash
npm install -g vercel
# npm error code EACCES
# npm error syscall mkdir
# npm error path /usr/lib/node_modules/vercel
# npm error errno -13


## Root Cause
WSL2 `npm` attempting to write to system directories without proper permissions.

---

## Solution Applied

### Quick Resolution
```bash
# Changed directory context
cd /mnt/c/Users/Administrator/Desktop/Shubhadeep/Devops_Project/
npm install -g vercel   # Worked successfully
```

### Proper Solution (Documented for Future)
```
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g vercel
```
