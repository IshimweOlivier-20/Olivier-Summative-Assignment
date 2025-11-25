# Frontend UI (Olivier)

This folder contains the frontend HTML, Tailwind and jQuery implementation for the Olivier project.

How to use
- Edit `js/config.js` and set `API_BASE_URL` to your backend (for example `http://localhost:3000`).
- Open the pages in a static server (or your file browser for quick testing): `index.html`, `login.html`, `signup.html`, `events.html`, `announcements.html`, `promos.html`, `admin/dashboard.html`.

Notes
- The code uses jQuery AJAX helpers in `js/api.js`. Authorized requests include `Authorization: Bearer <token>` when logged in.
- Role-based client guards are implemented in `js/auth.js` (functions `isAdmin()` and `isAuthenticated()`). Comments indicate where UI-level guards are enforced.
- This frontend is a scaffold and implements the major flows (auth, events, announcements, promos, admin dashboard). You will need to wire file uploads and full CRUD pages to the API endpoints.

Files added
- `index.html`, `login.html`, `signup.html`, `events.html`, `announcements.html`, `promos.html`, `admin/dashboard.html`
- `js/config.js`, `js/api.js`, `js/auth.js`, `js/main.js`
# UI Implementation