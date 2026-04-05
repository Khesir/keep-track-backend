import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class PayPlannedPaymentDto {
  @IsDateString() paidDate: string;
  @IsBoolean() createTransaction: boolean;
  @IsOptional() @IsString() transactionNotes?: string;
}
