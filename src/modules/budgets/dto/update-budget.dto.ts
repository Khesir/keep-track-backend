import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBudgetDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsNumber() customTargetAmount?: number;
  @IsOptional() @IsEnum(['active', 'closed']) status?: string;
}
