import type { Collection } from 'mongodb';

export interface MigrationDatabase {
  collection: (name: string) => Collection;
}

export interface Migration {
  name: string;
  description: string;
  up: (db: MigrationDatabase) => Promise<void>;
  down?: (db: MigrationDatabase) => Promise<void>;
}

export interface MigrationRecord {
  name: string;
  executedAt: Date;
  batch: number;
}
