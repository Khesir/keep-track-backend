import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAccountDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional()
  @IsEnum(['cash', 'bank', 'credit', 'investment', 'savings', 'other'])
  accountType?: string;
  @IsOptional() @IsNumber() balance?: number;
  @IsOptional() @IsString() colorHex?: string;
  @IsOptional() @IsNumber() iconCodePoint?: number;
  @IsOptional() @IsString() bankAccountNumber?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsBoolean() isArchived?: boolean;
  @IsOptional() @IsString() imageUrl?: string;
}
