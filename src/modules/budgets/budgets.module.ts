import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetsController } from './budgets.controller';
import { BudgetCategoriesController } from './budget-categories.controller';
import { BudgetsService } from './budgets.service';
import { Budget, BudgetSchema } from 'src/schemas/budget.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }])],
  controllers: [BudgetsController, BudgetCategoriesController],
  providers: [BudgetsService],
  exports: [BudgetsService],
})
export class BudgetsModule {}
