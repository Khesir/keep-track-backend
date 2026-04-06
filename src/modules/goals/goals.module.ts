import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { Goal, GoalSchema } from '../../schemas/goal.schema';
import { Transaction, TransactionSchema } from 'src/schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Goal.name, schema: GoalSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
