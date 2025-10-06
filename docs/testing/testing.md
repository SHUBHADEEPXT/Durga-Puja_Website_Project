# Testing Documentation

## Overview
Comprehensive testing strategy covering unit tests, integration tests, and end-to-end tests for the Durga Puja Platform.

---

## 🎯 Testing Strategy

**Test Pyramid:**
```
          /\
         /  \
        / E2E\          ← 10% (Critical user flows)
       /______\
      /        \
     /Integration\      ← 30% (API + DB tests)
    /____________\
   /              \
  /   Unit Tests   \    ← 60% (Functions, components)
 /__________________\
```

**Interview Explanation:** "I follow the testing pyramid principle: heavy unit testing for fast feedback, moderate integration testing for API reliability, and minimal E2E tests for critical user journeys. This balances test coverage with execution speed."

---

## 🧪 Test Types

### 1. Unit Tests
**Purpose:** Test individual functions and components in isolation

**Coverage:** 
- React components (frontend)
- API controllers (backend)
- Utility functions
- Data models

**Example:**
```javascript
// Testing React component
test('displays pandal name correctly', () => {
  render(<PandalCard name="Test Pandal" />);
  expect(screen.getByText('Test Pandal')).toBeInTheDocument();
});
```

---

### 2. Integration Tests
**Purpose:** Test API endpoints with database interactions

**Coverage:**
- API routes with real MongoDB
- Image upload with Cloudinary
- Database queries and mutations

**Example:**
```javascript
// Testing API endpoint
test('POST /api/pandals creates new pandal', async () => {
  const response = await request(app)
    .post('/api/pandals')
    .send({ name: 'New Pandal', location: 'Kolkata' });
  
  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
});
```

---

### 3. End-to-End Tests
**Purpose:** Test complete user workflows

**Coverage:**
- User can upload pandal photos
- User can view pandal gallery
- User can like pandals

---

## 📂 Test File Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PandalCard.jsx
│   │   │   └── __tests__/
│   │   │       └── PandalCard.test.jsx
│   │   └── __tests__/
│   │       └── App.test.jsx
│   └── vitest.config.js
│
└── backend/
    ├── src/
    │   ├── controllers/
    │   │   └── pandalController.js
    │   └── models/
    │       └── Pandal.js
    └── tests/
        ├── unit/
        │   └── pandalController.test.js
        └── integration/
            └── pandalRoutes.test.js
```

---

## 🚀 Running Tests

### Frontend Tests

**Run all tests:**
```bash
cd frontend
npm test
```

**Run with coverage:**
```bash
npm run test:coverage
```

**Watch mode:**
```bash
npm run test:watch
```

**Expected Output:**
```
 ✓ src/__tests__/App.test.jsx (2 tests)
 ✓ src/components/__tests__/PandalCard.test.jsx (3 tests)

Test Files: 2 passed (2)
Tests: 5 passed (5)
Coverage: 85% statements, 80% branches
```

---

### Backend Tests

**Run all tests:**
```bash
cd backend
npm test
```

**Run specific test file:**
```bash
npm test -- pandalController.test.js
```

**Run with coverage:**
```bash
npm run test:coverage
```

**Expected Output:**
```
 PASS  tests/unit/pandalController.test.js
 PASS  tests/integration/pandalRoutes.test.js

Test Suites: 2 passed, 2 total
Tests: 12 passed, 12 total
Coverage: 78% statements
```

---

## 🔧 Test Configuration

### Frontend (Vitest)

**File:** `frontend/vitest.config.js`
```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/__tests__/']
    }
  }
});
```

**Interview Note:** "I use Vitest because it's fast and integrates seamlessly with Vite. It's significantly faster than Jest for React apps."

---

### Backend (Jest)

**File:** `backend/jest.config.js`
```javascript
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ]
};
```

---

## 📊 Coverage Requirements

**Current Coverage:**
- Frontend: ~85% (Good for UI components)
- Backend: ~78% (Acceptable for API layer)

**Production Target:**
- Frontend: 80%+ 
- Backend: 85%+ 
- Critical paths: 95%+

**Interview Answer:** "I aim for 80%+ coverage but focus on meaningful tests rather than just hitting a number. Critical business logic and API endpoints have higher coverage requirements."

---

## 🐛 Testing Current Issues

### Issue 1: Missing Coverage Dependency
**Problem:** Frontend tests fail with missing `@vitest/coverage-v8`

**Status:** ✅ Fixed
```bash
npm install --save-dev @vitest/coverage-v8
```

### Issue 2: MongoDB Container in CI
**Problem:** GitHub Actions MongoDB service fails

**Solution:** Simplified backend tests to avoid external dependencies
```javascript
// Mock MongoDB for CI
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true)
}));
```

**Interview Explanation:** "CI/CD pipelines have resource constraints. I mock external services in CI and run full integration tests locally or in staging environments."

---

## 🔄 CI/CD Integration

### GitHub Actions Workflow

Tests run automatically on:
- Every push to `main` branch
- Every pull request
- Before deployment

**Pipeline Flow:**
```
Code Push → Install Dependencies → Run Tests → Generate Coverage → 
Report Results → Block Merge if Tests Fail
```

**Configuration:** `.github/workflows/cicd-pipeline.yaml`

---

## 🛠️ Testing Tools

**Frontend:**
- Vitest - Test runner
- React Testing Library - Component testing
- @testing-library/jest-dom - DOM matchers
- @vitest/coverage-v8 - Coverage reports

**Backend:**
- Jest - Test runner
- Supertest - HTTP assertions
- MongoDB Memory Server - In-memory database for tests
- Nock - HTTP mocking

---

## 📈 Continuous Improvement

**Test Metrics Tracked:**
- Coverage percentage
- Test execution time
- Flaky test rate
- Build failure rate

**Monthly Review:**
- Identify untested code paths
- Refactor slow tests
- Update mocks when APIs change
- Remove obsolete tests

---

## 🎯 Testing Best Practices

1. ✅ **Write tests first** (TDD when possible)
2. ✅ **One assertion per test** (mostly)
3. ✅ **Descriptive test names** 
4. ✅ **Arrange-Act-Assert** structure
5. ✅ **Clean up after tests**
6. ✅ **Mock external dependencies**
7. ✅ **Test error cases** too
8. ✅ **Keep tests maintainable**

**Interview Note:** "Good tests serve as living documentation. When I read a test file, I should understand what the component/function does without looking at the implementation."

---

## 🚨 When Tests Fail

**Local Development:**
```bash
# Run tests in watch mode
npm run test:watch

# Run specific test
npm test PandalCard

# Update snapshots if UI changed intentionally
npm test -- -u
```

**CI/CD Pipeline:**
- Check GitHub Actions logs
- Verify environment variables
- Ensure dependencies installed correctly
- Check if MongoDB/services started

**Common Issues:**
- Forgot to await async operations
- Mock not properly scoped
- Race conditions in tests
- Environment-specific failures

---

## 📝 Adding New Tests

**Checklist when adding features:**
1. ✅ Write failing test first
2. ✅ Implement feature
3. ✅ Make test pass
4. ✅ Refactor if needed
5. ✅ Verify coverage increased
6. ✅ Update this documentation

**Example Workflow:**
```bash
# 1. Create test file
touch src/components/__tests__/NewComponent.test.jsx

# 2. Write test (it will fail)
# 3. Implement component
# 4. Run tests
npm test NewComponent

# 5. Verify it passes
# 6. Check coverage
npm run test:coverage
```

---

