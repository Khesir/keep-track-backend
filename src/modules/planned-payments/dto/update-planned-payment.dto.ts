import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePlannedPaymentDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() payee?: string;
  @IsOptional() @IsNumber() amount?: number;
  @IsOptional() @IsDateString() nextPaymentDate?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsNumber() remainingInstallments?: number;
  @IsOptional() @IsEnum(['active', 'paused', 'cancelled', 'closed']) status?: string;
}
