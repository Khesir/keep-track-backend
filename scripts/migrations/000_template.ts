/**
 * Migration NNN: <short title>
 *
 * Why: <reason this migration exists — new index, schema change, data backfill, etc.>
 * Safe to re-run: <yes / no>
 */

import type { MigrationDatabase } from './types';

// Must be unique — the runner uses this as the primary key in the `migrations` collection.
// Convention: NNN_snake_case_description
export const name = 'NNN_your_migration_name';

export const description = 'One sentence describing what this migration does';

/**
 * Forward migration — applied by `npm run migrate`
 */
export async function up(db: MigrationDatabase): Promise<void> {
  // Add an index
  // await db.collection('users').createIndex({ email: 1 }, { unique: true });

  // Rename a field across all documents
  // await db.collection('accounts').updateMany(
  //   { oldField: { $exists: true } },
  //   { $rename: { oldField: 'newField' } },
  // );

  // Backfill a new field
  // await db.collection('tasks').updateMany(
  //   { newField: { $exists: false } },
  //   { $set: { newField: null } },
  // );

  // Remove a deprecated field
  // await db.collection('transactions').updateMany({}, { $unset: { deprecatedField: '' } });
}

/**
 * Rollback — applied by `npm run migrate:down`
 * Leave as no-op and document why if the change is irreversible.
 */
export async function down(db: MigrationDatabase): Promise<void> {
  // Reverse of up()

  // await db.collection('users').dropIndex('email_1');

  // await db.collection('accounts').updateMany(
  //   { newField: { $exists: true } },
  //   { $rename: { newField: 'oldField' } },
  // );

  // console.log('⚠ No-op — reversal not safe for this migration');
}
