import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateBucketDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsBoolean() isArchive?: boolean;
}
