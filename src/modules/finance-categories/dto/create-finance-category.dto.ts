import { IsEnum, IsString } from 'class-validator';

export class CreateFinanceCategoryDto {
  @IsString() name: string;
  @IsEnum(['income', 'expense', 'investment', 'savings', 'transfer']) type: string;
}
