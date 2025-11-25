import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import db from '../src/config/db.js';
import { createUser, findByEmail } from '../src/models/users.model.js';

// Load .env from project root
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Password123!';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrator';

async function run(){
  try{
    // ensure DB connection
    await db.query('SELECT 1');

    const existing = await findByEmail(ADMIN_EMAIL);
    if(existing){
      console.log('Admin user already exists:', ADMIN_EMAIL);
      console.log('Existing role:', existing.role);
      if(existing.role === 'admin') return process.exit(0);
      // Promote existing user
      const updated = await db.query('UPDATE users SET role=$1, updated_at=NOW() WHERE id=$2 RETURNING id, email, role', ['admin', existing.id]);
      console.log('Promoted existing user to admin:', updated.rows[0]);
      return process.exit(0);
    }

    const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const user = await createUser({ full_name: ADMIN_NAME, email: ADMIN_EMAIL, password_hash, role: 'admin' });
    console.log('Admin user created:', user);
    process.exit(0);
  }catch(err){
    console.error('Seed admin error', err);
    process.exit(1);
  }
}

run();
