import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';

import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { BucketsModule } from './modules/buckets/buckets.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { DebtsModule } from './modules/debts/debts.module';
import { FinanceCategoriesModule } from './modules/finance-categories/finance-categories.module';
import { GoalsModule } from './modules/goals/goals.module';
import { MonthPlansModule } from './modules/month-plans/month-plans.module';
import { PlannedPaymentsModule } from './modules/planned-payments/planned-payments.module';
import { PomodoroSessionsModule } from './modules/pomodoro-sessions/pomodoro-sessions.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';

let cachedConnection: any = null;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
        connectionFactory: (connection) => {
          if (cachedConnection) return cachedConnection;
          cachedConnection = connection;
          return connection;
        },
      }),
    }),
    AuthModule,
    UsersModule,
    AccountsModule,
    TransactionsModule,
    FinanceCategoriesModule,
    BudgetsModule,
    MonthPlansModule,
    DebtsModule,
    GoalsModule,
    PlannedPaymentsModule,
    BucketsModule,
    ProjectsModule,
    TasksModule,
    PomodoroSessionsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
