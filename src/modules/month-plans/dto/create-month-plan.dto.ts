import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateMonthPlanDto {
  @IsString() month: string;
  @IsOptional() @IsString() accountId?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsArray() budgetIds?: string[];
}
