# Seeding an Admin User (one-time)

This project includes a small Node script to create or promote an administrator account safely using the project's models and bcrypt for password hashing.

How to run

1. Ensure your backend `.env` (or environment) is set so the backend can connect to the database. Example `.env` values used by the project:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=mysecret
DB_NAME=civic_events_db
JWT_SECRET=supersecretkey
```

2. Optionally set admin credentials as environment variables, otherwise defaults are used:

```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Password123!
ADMIN_NAME="Site Admin"
```

3. Run the seed script from the `backend` folder:

```powershell
# from backend folder
node .\scripts\seed-admin.js
```

What it does

- If a user with `ADMIN_EMAIL` exists and already has `role = 'admin'`, the script exits (no-op).
- If a user with `ADMIN_EMAIL` exists but is not an admin, the script promotes them to admin.
- If the user does not exist, the script creates a new user with the given email and password, hashing the password with bcrypt and assigning `role = 'admin'`.

Security note

- This script is intended for local development and safe one-time setup. Do not expose it on production servers without access controls.
