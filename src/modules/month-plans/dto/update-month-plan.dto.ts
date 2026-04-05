import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateMonthPlanDto {
  @IsOptional() @IsString() accountId?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsArray() budgetIds?: string[];
}
