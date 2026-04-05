import { IsString } from 'class-validator';

export class CreateBucketDto {
  @IsString() name: string;
}
