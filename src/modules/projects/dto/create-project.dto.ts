import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsEnum(['active', 'postponed', 'closed']) status?: string;
  @IsOptional() @IsString() bucketId?: string;
  @IsOptional() metadata?: Record<string, any>;
}
