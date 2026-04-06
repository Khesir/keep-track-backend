import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ContributeGoalDto {
  @IsString() accountId: string;
  @IsNumber() amount: number;
  @IsOptional() @IsNumber() fee?: number;
  @IsOptional() @IsString() notes?: string;
}
