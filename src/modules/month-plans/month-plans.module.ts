import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonthPlansController } from './month-plans.controller';
import { MonthPlansService } from './month-plans.service';
import { MonthPlan, MonthPlanSchema } from 'src/schemas/month-plan.schema';
import { Budget, BudgetSchema } from 'src/schemas/budget.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MonthPlan.name, schema: MonthPlanSchema },
      { name: Budget.name, schema: BudgetSchema },
    ]),
  ],
  controllers: [MonthPlansController],
  providers: [MonthPlansService],
})
export class MonthPlansModule {}
