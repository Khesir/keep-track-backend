/**
 * Migration 001: Create indexes
 *
 * Why: Ensure all collections have indexes for common query patterns.
 *      createIndex is idempotent — safe to re-run.
 * Safe to re-run: yes
 */

import type { MigrationDatabase } from './types';

export const name = '001_create_indexes';
export const description = 'Create indexes on all collections for common query patterns';

export async function up(db: MigrationDatabase): Promise<void> {
  // users
  const users = db.collection('users');
  await users.createIndex({ authId: 1 } as any, { unique: true });
  await users.createIndex({ email: 1 } as any);
  console.log('✓ Indexed users');

  // accounts
  const accounts = db.collection('accounts');
  await accounts.createIndex({ userId: 1 } as any);
  console.log('✓ Indexed accounts');

  // transactions
  const transactions = db.collection('transactions');
  await transactions.createIndex({ userId: 1 } as any);
  await transactions.createIndex({ accountId: 1 } as any);
  await transactions.createIndex({ date: -1 } as any);
  await transactions.createIndex({ type: 1 } as any);
  await transactions.createIndex({ budgetId: 1 } as any, { sparse: true });
  await transactions.createIndex({ debtId: 1 } as any, { sparse: true });
  await transactions.createIndex({ goalId: 1 } as any, { sparse: true });
  console.log('✓ Indexed transactions');

  // finance categories
  const financeCategories = db.collection('financecategories');
  await financeCategories.createIndex({ userId: 1 } as any);
  console.log('✓ Indexed financecategories');

  // budgets
  const budgets = db.collection('budgets');
  await budgets.createIndex({ userId: 1 } as any);
  await budgets.createIndex({ accountId: 1 } as any);
  console.log('✓ Indexed budgets');

  // month plans
  const monthPlans = db.collection('monthplans');
  await monthPlans.createIndex({ userId: 1 } as any);
  await monthPlans.createIndex({ userId: 1, month: 1 } as any, { unique: true });
  console.log('✓ Indexed monthplans');

  // debts
  const debts = db.collection('debts');
  await debts.createIndex({ userId: 1 } as any);
  console.log('✓ Indexed debts');

  // goals
  const goals = db.collection('goals');
  await goals.createIndex({ userId: 1 } as any);
  console.log('✓ Indexed goals');

  // planned payments
  const plannedPayments = db.collection('plannedpayments');
  await plannedPayments.createIndex({ userId: 1 } as any);
  await plannedPayments.createIndex({ nextPaymentDate: 1 } as any);
  console.log('✓ Indexed plannedpayments');

  // buckets
  const buckets = db.collection('buckets');
  await buckets.createIndex({ userId: 1 } as any);
  console.log('✓ Indexed buckets');

  // projects
  const projects = db.collection('projects');
  await projects.createIndex({ userId: 1 } as any);
  await projects.createIndex({ bucketId: 1 } as any);
  console.log('✓ Indexed projects');

  // tasks
  const tasks = db.collection('tasks');
  await tasks.createIndex({ userId: 1 } as any);
  await tasks.createIndex({ projectId: 1 } as any);
  await tasks.createIndex({ dueDate: 1 } as any, { sparse: true });
  console.log('✓ Indexed tasks');

  // pomodoro sessions
  const pomodoroSessions = db.collection('pomodorosessions');
  await pomodoroSessions.createIndex({ userId: 1 } as any);
  await pomodoroSessions.createIndex({ projectId: 1 } as any, { sparse: true });
  await pomodoroSessions.createIndex({ startedAt: -1 } as any);
  console.log('✓ Indexed pomodorosessions');
}

export async function down(db: MigrationDatabase): Promise<void> {
  const collections = [
    'users', 'accounts', 'transactions', 'financecategories',
    'budgets', 'monthplans', 'debts', 'goals', 'plannedpayments',
    'buckets', 'projects', 'tasks', 'pomodorosessions',
  ];

  for (const name of collections) {
    try {
      await db.collection(name).dropIndexes();
    } catch {
      // Collection may not exist yet — fine
    }
  }

  console.log('✓ Rolled back migration 001');
}
