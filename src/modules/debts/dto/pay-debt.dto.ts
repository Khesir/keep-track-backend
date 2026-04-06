import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PayDebtDto {
  @IsString() accountId: string;
  @IsNumber() amount: number;
  @IsOptional() @IsNumber() fee?: number;
  @IsOptional() @IsString() notes?: string;
}
