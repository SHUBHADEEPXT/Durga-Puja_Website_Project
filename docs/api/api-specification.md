# 📡 API Specification

## Base URL
- Development: `http://localhost:5000`
- Production: `https://api.durgapuja.com`

## Authentication
```bash
# All API requests require authentication
Authorization: Bearer <jwt_token>
```

## Endpoints

### Pandals
- `GET /api/pandals` - List all pandals
- `POST /api/pandals` - Create new pandal
- `GET /api/pandals/:id` - Get pandal details
- `PUT /api/pandals/:id` - Update pandal
- `DELETE /api/pandals/:id` - Delete pandal

### Photos
- `POST /api/photos/upload` - Upload photo
- `GET /api/photos/:pandalId` - Get pandal photos
- `POST /api/photos/:id/like` - Like photo
