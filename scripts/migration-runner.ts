import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import type { Migration, MigrationDatabase, MigrationRecord } from './migrations/types';
import type { Collection } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('✗ MONGODB_URI is not set. Create a .env file or export the variable.');
  process.exit(1);
}

async function getMigrationsCollection(db: MigrationDatabase): Promise<Collection> {
  const collection = db.collection('migrations');
  await collection.createIndex({ name: 1 } as any, { unique: true });
  return collection as Collection;
}

async function loadMigrations(): Promise<Migration[]> {
  const migrationsDir = path.join(__dirname, 'migrations');

  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
    return [];
  }

  const ext = __filename.endsWith('.js') ? '.js' : '.ts';
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(ext) && f !== `types${ext}` && !f.startsWith('000_'))
    .sort();

  const migrations: Migration[] = [];

  for (const file of files) {
    const modulePath = path.join(migrationsDir, file);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require(modulePath) as any;

    if (!mod.name || !mod.up) {
      console.warn(`⚠ Skipping ${file}: missing name or up export`);
      continue;
    }

    migrations.push({
      name: mod.name,
      description: mod.description || 'No description',
      up: mod.up,
      down: mod.down,
    });
  }

  return migrations;
}

async function getExecutedMigrations(collection: Collection): Promise<string[]> {
  const docs = await collection.find({}).toArray();
  return docs.map((d) => (d as unknown as MigrationRecord).name);
}

async function getCurrentBatch(collection: Collection): Promise<number> {
  const docs = await collection.find({}).sort({ batch: -1 }).limit(1).toArray();
  return docs.length > 0 ? (docs[0] as unknown as MigrationRecord).batch : 0;
}

async function runUp(
  db: MigrationDatabase,
  migrations: Migration[],
  executed: string[],
  migrationsCollection: Collection,
): Promise<void> {
  const pending = migrations.filter((m) => !executed.includes(m.name));

  if (pending.length === 0) {
    console.log('✓ No pending migrations');
    return;
  }

  console.log(`Found ${pending.length} pending migration(s):\n`);

  const currentBatch = await getCurrentBatch(migrationsCollection);
  const nextBatch = currentBatch + 1;

  for (const migration of pending) {
    console.log(`Running: ${migration.name}`);
    console.log(`  ${migration.description}`);
    try {
      await migration.up(db);
      await migrationsCollection.insertOne({
        name: migration.name,
        executedAt: new Date(),
        batch: nextBatch,
      } as MigrationRecord);
      console.log(`✓ ${migration.name} completed\n`);
    } catch (error) {
      console.error(`✗ ${migration.name} failed:`, error);
      throw error;
    }
  }

  console.log(`✓ All done — ${pending.length} migration(s) run in batch ${nextBatch}`);
}

async function runDown(
  db: MigrationDatabase,
  migrations: Migration[],
  migrationsCollection: Collection,
): Promise<void> {
  const lastBatch = await getCurrentBatch(migrationsCollection);

  if (lastBatch === 0) {
    console.log('✓ No migrations to rollback');
    return;
  }

  const toRollback = (await migrationsCollection
    .find({ batch: lastBatch })
    .sort({ name: -1 })
    .toArray()) as unknown as MigrationRecord[];

  console.log(`Rolling back batch ${lastBatch} (${toRollback.length} migration(s)):\n`);

  for (const record of toRollback) {
    const migration = migrations.find((m) => m.name === record.name);
    if (!migration) {
      console.warn(`⚠ ${record.name} not found in files, skipping`);
      continue;
    }

    console.log(`Rolling back: ${migration.name}`);
    try {
      if (migration.down) {
        await migration.down(db);
      } else {
        console.warn(`  (no down method — skipped)`);
      }
      await migrationsCollection.deleteOne({ name: record.name });
      console.log(`✓ ${migration.name} rolled back\n`);
    } catch (error) {
      console.error(`✗ ${migration.name} rollback failed:`, error);
      throw error;
    }
  }

  console.log(`✓ Batch ${lastBatch} rolled back`);
}

async function runStatus(
  migrations: Migration[],
  executed: string[],
  migrationsCollection: Collection,
): Promise<void> {
  if (migrations.length === 0) {
    console.log('No migration files found');
    return;
  }

  const docs = (await migrationsCollection.find({}).toArray()) as unknown as MigrationRecord[];
  const byName = new Map(docs.map((d) => [d.name, d]));

  for (const m of migrations) {
    const record = byName.get(m.name);
    if (record) {
      const when = record.executedAt.toISOString().replace('T', ' ').slice(0, 19);
      console.log(`  ✅ applied   [batch ${record.batch}] ${m.name}  (${when})`);
    } else {
      console.log(`  ⏳ pending              ${m.name}`);
    }
  }
}

async function main(): Promise<void> {
  const command = process.argv[2];
  const direction = command === 'down' ? 'down' : command === 'status' ? 'status' : 'up';

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI as string);
  console.log('Connected.\n');

  const mongoDb = mongoose.connection.db;
  if (!mongoDb) throw new Error('Database connection not available');

  const db = mongoDb as unknown as MigrationDatabase;
  const migrationsCollection = await getMigrationsCollection(db);
  const allMigrations = await loadMigrations();
  const executed = await getExecutedMigrations(migrationsCollection);

  try {
    if (direction === 'up') {
      await runUp(db, allMigrations, executed, migrationsCollection);
    } else if (direction === 'down') {
      await runDown(db, allMigrations, migrationsCollection);
    } else {
      await runStatus(allMigrations, executed, migrationsCollection);
    }
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
