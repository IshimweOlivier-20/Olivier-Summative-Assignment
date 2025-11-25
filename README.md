# Civic Events — Summative Assignment

Simple event management web app (frontend + backend) used for the summative assessment. The project includes:

- Static frontend (HTML, Tailwind, jQuery) in `frontend/` and a small shared `js/` folder.
- Node.js + Express backend in `backend/` with PostgreSQL storage.
- JWT authentication with admin and normal user roles.

This README explains how to run the app locally, apply database migrations, seed an admin user, and where to find key features.

---

## Tech Stack

- Frontend: Static HTML, TailwindCSS (CDN), jQuery
- Backend: Node.js, Express, node-postgres (pg), bcrypt, jsonwebtoken, multer
- Database: PostgreSQL (SQL migration in `backend/migrations/`)

---

## Quick setup (local)

1. Prerequisites
   - Node.js (>= 16), npm
   - PostgreSQL (or Docker running a Postgres container)
   - Optional: `psql` for running SQL migrations, `python` or `http-server` to serve frontend files

2. Install backend dependencies

   Open PowerShell and run:

   ```powershell
   cd backend
   npm install
   ```

3. Create database and run migrations

   - If you're using a local Postgres instance, create a database (example):

   ```powershell
   # adjust DB name/user/password as needed
   createdb civicevents
   psql -d civicevents -f migrations/001_create_tables.sql
   ```

   - If you're using Docker, run Postgres and then execute the SQL migration against the running container.

4. Environment variables

   Create a `.env` file in `backend/` (or set env vars in your shell). Important variables include:

   - `DB_HOST` - Postgres host (default: `localhost`)
   - `DB_PORT` - Postgres port (default: `5432`)
   - `DB_NAME` - Database name (e.g., `civicevents`)
   - `DB_USER` - Database user
   - `DB_PASSWORD` - Database password
   - `JWT_SECRET` - A secret used to sign JWT tokens
   - `PORT` - Backend server port (default: `4000`)

   Example `.env` (do not check this into source control):

   ```text
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=civicevents
   DB_USER=postgres
   DB_PASSWORD=postgres
   JWT_SECRET=change_this_to_a_strong_value
   PORT=4000
   ```

5. Seed an admin user

   A seed script exists at `backend/scripts/seed-admin.js`. To run it (after `npm install` and with env vars set):

   ```powershell
   node backend/scripts/seed-admin.js
   ```

   By default the script uses `ADMIN_EMAIL=admin@example.com` and `ADMIN_PASSWORD=admin123`. You can override these environment variables when running the script.

6. Start the backend

   ```powershell
   cd backend
   node server.js
   ```

   The backend listens on `http://localhost:4000` by default (see `frontend/js/config.js` which points frontend requests to that URL).

7. Serve/Open the frontend

   The frontend is static HTML under `frontend/`. You can open `frontend/index.html` directly in a browser, but using a static server is recommended to avoid some CORS/file-origin issues:

   ```powershell
   # Option A: use Python (if installed)
   cd frontend
   python -m http.server 8080

   # Option B: use http-server via npx
   npx http-server . -p 8080
   ```

   Then open `http://localhost:8080` in your browser.

---

## Features

- Signup / Login / Logout (JWT-based)
- Role-based UI: admin users see the admin dashboard and management pages
- Admin can create/edit/delete events, promos (video), announcements (audio), and notifications
- Content can be published/unpublished; public GET endpoints only return `published` content to anonymous users
- Users can register for events and submit feedback

---

## API (short list)

- `POST /api/auth/signup` — create a new user
- `POST /api/auth/login` — authenticate and receive JWT
- `GET /api/events` — list events (only published events visible to anonymous)
- `GET /api/events/:id` — get event details
- `POST /api/events` — create event (admin)
- `GET /api/promos` — list promos
- `GET /api/promos/:id` — get promo
- `POST /api/announcements` — create announcement (admin)
- `POST /api/notifications` — create notification (admin)

Note: All modifying endpoints require an `Authorization: Bearer <token>` header.

---

## Files to look at

- `frontend/` — static UI pages, contains `js/` helpers (`api.js`, `auth.js`, `config.js`, `main.js`)
- `backend/` — Express app, controllers, models, middlewares
- `backend/migrations/001_create_tables.sql` — DB schema
- `backend/scripts/seed-admin.js` — admin seeding helper

---

## Quick developer tips

- If you change DB schema, re-run the SQL migration or apply incremental migrations.
- The frontend expects the backend at `http://localhost:4000`. Update `frontend/js/config.js` to change the API base URL.
- The repository includes a PowerShell quick-test script at `backend/run_quick_tests.ps1` to exercise signup/login flows.

---

## Commit & Push

When you are ready to push changes to a remote repository, create a new branch and push that branch. Example PowerShell commands:

```powershell
git checkout -b import-local-changes
git add -A
git commit -m "feat: add admin auth, role-based UI, and publish controls"
git push -u origin import-local-changes
```

Replace the commit message above with one of your choosing (a recommended simple message is shown in the repository root).

---

If you want, I can also create a PR draft message for you or help exclude specific files before pushing (for example, `TODO.txt` or any AI artifacts).
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/2cX0K4ec)
# CivicEvent+ Project