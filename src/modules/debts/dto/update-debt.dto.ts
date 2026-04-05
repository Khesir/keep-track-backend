import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDebtDto {
  @IsOptional() @IsString() personName?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() remainingAmount?: number;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsEnum(['active', 'overdue', 'settled']) status?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsNumber() monthlyPaymentAmount?: number;
  @IsOptional() @IsDateString() nextPaymentDate?: string;
}
