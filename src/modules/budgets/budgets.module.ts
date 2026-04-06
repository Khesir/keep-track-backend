import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetsController } from './budgets.controller';
import { BudgetCategoriesController } from './budget-categories.controller';
import { BudgetsService } from './budgets.service';
import { Budget, BudgetSchema } from 'src/schemas/budget.schema';
import { FinanceCategory, FinanceCategorySchema } from 'src/schemas/finance-category.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Budget.name, schema: BudgetSchema },
    { name: FinanceCategory.name, schema: FinanceCategorySchema },
  ])],
  controllers: [BudgetsController, BudgetCategoriesController],
  providers: [BudgetsService],
  exports: [BudgetsService],
})
export class BudgetsModule {}
