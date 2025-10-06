# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://durga-puja-backend.onrender.com/api
```

## Overview
RESTful API for Durga Puja Pandal Explorer platform. Handles pandal data management, image uploads, and user interactions.

---

## 🔗 Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-06T10:30:00Z",
  "database": "connected"
}
```

**Interview Note:** "I implemented health check endpoints for monitoring and load balancer integration. This allows Kubernetes liveness/readiness probes to verify service health."

---

### Get All Pandals
```http
GET /api/pandals
```

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset (default: 0)
- `sort` (optional): Sort field (e.g., `createdAt`, `name`)

**Response:**
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "_id": "64f8a9b2c3d4e5f6g7h8i9j0",
      "name": "Sarbojonin Durgotsab",
      "location": "Salt Lake, Kolkata",
      "images": ["https://cloudinary.com/..."],
      "description": "Traditional pandal with cultural theme",
      "createdAt": "2025-09-20T08:00:00Z"
    }
  ]
}
```

**Interview Explanation:** "This endpoint supports pagination and sorting for efficient data retrieval. In production, I'd add Redis caching here to reduce database load during high traffic."

---

### Get Single Pandal
```http
GET /api/pandals/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a9b2c3d4e5f6g7h8i9j0",
    "name": "Sarbojonin Durgotsab",
    "location": "Salt Lake, Kolkata",
    "images": ["https://cloudinary.com/..."],
    "description": "Traditional pandal",
    "likes": 245,
    "views": 1523,
    "createdAt": "2025-09-20T08:00:00Z"
  }
}
```

---

### Create Pandal
```http
POST /api/pandals
Content-Type: multipart/form-data
```

**Request Body:**
```
name: Sarbojonin Durgotsab
location: Salt Lake, Kolkata
description: Beautiful traditional setup
images: [File, File]  // Multiple image files
```

**Response:**
```json
{
  "success": true,
  "message": "Pandal created successfully",
  "data": {
    "_id": "64f8a9b2c3d4e5f6g7h8i9j0",
    "name": "Sarbojonin Durgotsab",
    "images": ["https://cloudinary.com/..."]
  }
}
```

**Interview Note:** "I used Cloudinary for image storage to handle the heavy lifting of image optimization, resizing, and CDN delivery. This is more scalable than storing images directly on the server."

---

### Update Pandal
```http
PUT /api/pandals/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Pandal Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pandal updated successfully",
  "data": { ... }
}
```

---

### Delete Pandal
```http
DELETE /api/pandals/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Pandal deleted successfully"
}
```

**Interview Explanation:** "Delete functionality is essential for content moderation. In production, I'd add authentication middleware to ensure only admins can delete content."

---

### Like Pandal
```http
POST /api/pandals/:id/like
```

**Response:**
```json
{
  "success": true,
  "likes": 246
}
```

---

## 🔒 Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Error message description",
  "statusCode": 400
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

**Interview Note:** "I implemented consistent error handling middleware to ensure all API responses follow the same structure. This makes frontend error handling predictable and easier to debug."

---

## 🎯 Rate Limiting

**Current:** No rate limiting (development)

**Production Plan:** 
- 100 requests per 15 minutes per IP
- Using express-rate-limit middleware
- Redis-based distributed rate limiting for multiple instances

---

## 📊 Database Schema

### Pandal Model
```javascript
{
  name: String (required, min: 3 chars),
  location: String (required),
  description: String,
  images: [String],  // Cloudinary URLs
  likes: Number (default: 0),
  views: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Interview Explanation:** "I used Mongoose for MongoDB ODM to ensure data validation at the application level. The schema enforces minimum name length and required fields before database insertion."

---

## 🚀 Performance Considerations

**Current Implementation:**
- Direct MongoDB queries
- Cloudinary CDN for images
- CORS enabled for cross-origin requests

**Future Optimizations:**
- Redis caching for frequently accessed pandals
- Database indexing on location and createdAt fields
- GraphQL for flexible client queries
- Pagination improvements with cursor-based approach

---

## 🔧 Local Development

**Environment Variables:**
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/durga-puja
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Start Server:**
```bash
cd backend
npm install
npm run dev
```

**Run Tests:**
```bash
npm test
```

---

## 📝 API Testing

**Using cURL:**
```bash
# Get all pandals
curl http://localhost:5000/api/pandals

# Create pandal
curl -X POST http://localhost:5000/api/pandals \
  -F "name=Test Pandal" \
  -F "location=Kolkata" \
  -F "images=@photo.jpg"
```

**Using Postman:**
Import the collection from `docs/api/postman_collection.json`

---
