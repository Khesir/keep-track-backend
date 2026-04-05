import { IsNumber, IsString } from 'class-validator';

export class BudgetCategoryDto {
  @IsString() financeCategoryId: string;
  @IsNumber() targetAmount: number;
}

export class UpdateBudgetCategoryDto {
  @IsNumber() targetAmount: number;
}
