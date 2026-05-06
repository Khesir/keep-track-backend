/**
 * Migration 001: Create initial admin user
 *
 * Why: Seeds the database with an initial admin user for first-time setup.
 * Safe to re-run: Yes — checks existence before inserting.
 */

import type { MigrationDatabase } from './types';
import * as bcrypt from 'bcrypt';

export const name = '001_create_initial_admin';

export const description = 'Seeds the initial admin user into the users collection';

/**
 * Forward migration — applied by `npm run migrate`
 */
export async function up(db: MigrationDatabase): Promise<void> {
  const users = db.collection('users');

  const existing = await users.findOne({ email: 'admin@example.com' });
  if (existing) {
    console.log('⚠ Admin user already exists — skipping');
    return;
  }

  const passwordHash = await bcrypt.hash('changeme123', 10);

  await users.insertOne({
    email: 'admin@example.com',
    passwordHash,
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('✅ Admin user created — remember to change the default password!');
}

/**
 * Rollback — applied by `npm run migrate:down`
 */
export async function down(db: MigrationDatabase): Promise<void> {
  await db.collection('users').deleteOne({ email: 'admin@example.com' });
  console.log('✅ Admin user removed');
}