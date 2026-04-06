import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonthPlansController } from './month-plans.controller';
import { MonthPlansService } from './month-plans.service';
import { MonthPlan, MonthPlanSchema } from '../../schemas/month-plan.schema';
import { Budget, BudgetSchema } from '../../schemas/budget.schema';

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
