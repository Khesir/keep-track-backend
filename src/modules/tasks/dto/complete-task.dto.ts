import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CompleteTaskDto {
  @IsBoolean() createTransaction: boolean;
  @IsOptional() @IsNumber() actualAmount?: number;
  @IsOptional() @IsString() accountId?: string;
  @IsOptional() @IsDateString() transactionDate?: string;
}
