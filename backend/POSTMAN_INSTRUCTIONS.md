# Postman Testing Instructions

This document explains how to test the backend API with Postman (or similar REST client).

Base URL
- Default: `http://localhost:4000`
- Update your Postman environment variable `baseUrl` to that value.

Common headers
- `Content-Type: application/json` for JSON requests
- For protected routes: `Authorization: Bearer <token>` (replace `<token>` with JWT received from login)

Auth
1. Signup
   - POST `{{baseUrl}}/api/auth/signup`
   - Body (JSON):
     {
       "full_name": "Test User",
       "email": "user@example.com",
       "password": "StrongP@ssw0rd"
     }
   - Expect: 201 created (data: user)

2. Login
   - POST `{{baseUrl}}/api/auth/login`
   - Body (JSON): { "email": "user@example.com", "password": "StrongP@ssw0rd" }
   - Expect: 200 (data: { token, user })
   - Save `token` to Postman environment variable `authToken`.

Events (requires authentication)
- List events (GET)
  - GET `{{baseUrl}}/api/events`
  - Header: `Authorization: Bearer {{authToken}}`
- Get single event
  - GET `{{baseUrl}}/api/events/:id`
- Create event (admin only, multipart/form-data)
  - POST `{{baseUrl}}/api/events`
  - Headers: `Authorization: Bearer {{authToken}}`
  - Body: form-data
    - `title`: text
    - `description`: text
    - `location`: text
    - `starts_at`: 2025-12-01T18:00:00Z
    - `ends_at`: 2025-12-01T20:00:00Z
    - `image`: file (choose image file)
  - Expect: 201 and `data` contains event and `metadata.image_url` if file uploaded.
- Update event (admin)
  - PUT `{{baseUrl}}/api/events/:id` (multipart/form-data supported)
- Delete event (admin)
  - DELETE `{{baseUrl}}/api/events/:id`

Notifications
- List: GET `{{baseUrl}}/api/notifications` (auth required)
- Delete (admin): DELETE `{{baseUrl}}/api/notifications/:id`

Useful notes
- If you get a `401` response, the token is invalid/expired — log in again and update `authToken`.
- File uploads are accepted by endpoints that use `multer`; use `form-data` body type in Postman.
- If your backend is running on a different port, update `baseUrl` accordingly.

Quick test script (no Postman needed)
- There's a small PowerShell script included to quickly test auth and a protected endpoint without Postman: `backend/run_quick_tests.ps1`.
- Usage:

```powershell
cd backend
.\run_quick_tests.ps1 -BaseUrl http://localhost:4000
```

It will attempt `/health`, create a test signup user, login, print the token, and call `GET /api/events` using the token. Use this when you want to reproduce login/signup issues quickly.

Running the backend locally
1. Install dependencies and start server

```powershell
cd backend
npm install
npm run dev
```

2. Ensure your database (Postgres) is configured and migrations run if necessary (see backend README).

Contact
- If anything returns unexpected errors, capture full response body and status and share it so we can diagnose.
