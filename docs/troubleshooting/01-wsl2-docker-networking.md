# WSL2 + Docker + Vite Networking Issue

**Issue ID**: WSL2-001  
**Date**: September 20, 2024  
**Severity**: HIGH  
**Status**: DOCUMENTED (Workaround Implemented)

---

## Problem Description

Frontend container running successfully but `localhost:3000` returns 404 Not Found.

### Environment
- OS: Windows 11 with WSL2
- Docker: v28.3.3
- Docker Compose: v2.36.2
- Frontend: React with Vite v4.5.14


### Symptoms

- Container status - all running
```
docker compose ps
```

- Result: All containers UP and running ✅
- Vite server logs - running correctly
```
docker compose logs frontend
```
- Output: VITE v4.5.14 ready in 14002 ms
         ➜ Local: http://localhost:3000/
         ➜ Network: http://172.20.0.5:3000/

- Host access - failing
```
curl localhost:3000
```
- Result: HTTP/1.1 404 Not Found


### Investigation Process

- Network Analysis
```
   netstat -tlnp | grep 3000
```
	- Result: tcp6 :::3000 LISTEN (IPv6 binding issue)
- Container Internal Test
```
   docker compose exec backend sh -c "apk add curl && curl -I http://frontend:3000"
```
	- Result: HTTP/1.1 403 Forbidden (Vite host validation)

- Backend Verification
```
   curl localhost:5000
```
	- Result: HTTP/1.1 200 OK ✅ (Backend working correctly)

### Root Cause Analysis
- Primary Issues
	- WSL2 Network Translation: Multiple network layers interfering
	- Windows Host (127.0.0.1) → WSL2 VM → Docker → Container
	- Vite Host Validation: Development server blocking external requests
	- IPv6/IPv4 Binding Conflict: WSL2 creating IPv6 bindings instead of IPv4

### Evidence

✅ Backend accessible (proves Docker setup correct)
✅ Container processes running (proves application code valid)
✅ Vite server started (proves build successful)
❌ Vite blocks external access (403 Forbidden)
❌ WSL2 IPv6 binding instead of IPv4

### Solutions Attempted

- Configuration Fixes (Failed)
```
javascript// vite.config.js attempts
server: {
  host: '0.0.0.0',
  port: 3000,
  strictPort: true,
  allowedHosts: ['localhost', '127.0.0.1'],
  origin: 'http://localhost:3000'
}
```
- docker-compose.yml attempts
```
services:
  frontend:
    ports:
      - "127.0.0.1:3000:3000"  # Explicit localhost binding
```

### Working Solutions

- Local Development Server (Immediate)
```
   cd frontend
   npm run dev -- --host 0.0.0.0 --port 3001
```
- Cloud Deployment (Production)
- Frontend: Vercel deployment
- Backend: Render deployment
- Result: ✅ Works perfectly in cloud environment


### Strategic Decision

- Adopted Hybrid Approach:
	- Development: Local npm dev server for frontend development
	- Backend: Docker containers for API and database
	- Production: Cloud deployment eliminates networking issues

### Interview Talking Points

- Technical Skills Demonstrated
	- Systematic Debugging: Methodical investigation through network layers
	- Root Cause Analysis: Identified WSL2 as core issue, not application code
	- Platform Knowledge: Understanding of Docker networking and Vite dev server
	- Strategic Thinking: Chose cloud deployment over extended local debugging

### Problem-Solving Approach

- Reproduce and Document: Confirmed issue with clear evidence
- Isolate Variables: Tested each component (backend, containers, network)
- Research Solutions: Multiple configuration attempts with documentation
- Evaluate Options: Compared time investment vs alternative approaches
- Strategic Decision: Moved to cloud deployment for faster delivery

### Business Impact

- Time Management: Avoided weeks of WSL2 debugging
- Delivery Focus: Prioritized working solution over perfect local setup
- Production Readiness: Cloud deployment matches production environment

---
## Lessons Learned

- Technical
	- WSL2 + Docker + Vite requires specific networking configuration
	- Cloud deployment often simpler than complex local environment setup
	- Backend/frontend can use different development approaches effectively

- Process
	- Document investigation steps immediately during debugging
	- Set time limits for complex environment issues
	- Consider alternative approaches early in troubleshooting

---

## Prevention Strategies

- For Future Projects
	- Test Environment Compatibility early in project setup
	- Have Cloud Development Fallback ready
	- Document Environment-Specific Issues for team knowledge
	- Consider Development Environment Standardization (dev containers, etc.)

---

## References

- Vite Docker Configuration
- WSL2 Networking Documentation
- Docker Compose Networking

