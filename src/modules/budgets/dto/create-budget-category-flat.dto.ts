import { IsNumber, IsString } from 'class-validator';

export class CreateBudgetCategoryFlatDto {
  @IsString() budgetId: string;
  @IsString() financeCategoryId: string;
  @IsNumber() targetAmount: number;
}
