import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString() name: string;
  @IsEnum(['cash', 'bank', 'credit', 'investment', 'savings', 'other'])
  accountType: string;
  @IsNumber() balance: number;
  @IsOptional() @IsString() colorHex?: string;
  @IsOptional() @IsNumber() iconCodePoint?: number;
  @IsOptional() @IsString() bankAccountNumber?: string;
}
