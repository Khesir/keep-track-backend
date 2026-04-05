import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateFinanceCategoryDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional()
  @IsEnum(['income', 'expense', 'investment', 'savings', 'transfer'])
  type?: string;
  @IsOptional() @IsBoolean() isArchive?: boolean;
}
