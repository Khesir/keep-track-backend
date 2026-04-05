import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsEnum(['active', 'postponed', 'closed']) status?: string;
  @IsOptional() @IsString() bucketId?: string;
  @IsOptional() @IsBoolean() isArchived?: boolean;
  @IsOptional() metadata?: Record<string, any>;
}
