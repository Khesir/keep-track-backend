import {
  IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString,
} from 'class-validator';

export class UpdateTaskDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(['todo', 'inProgress', 'completed', 'cancelled']) status?: string;
  @IsOptional() @IsEnum(['low', 'medium', 'high', 'urgent']) priority?: string;
  @IsOptional() @IsString() projectId?: string;
  @IsOptional() @IsString() bucketId?: string;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsBoolean() archived?: boolean;
  @IsOptional() @IsBoolean() isMoneyRelated?: boolean;
  @IsOptional() @IsNumber() expectedAmount?: number;
}
