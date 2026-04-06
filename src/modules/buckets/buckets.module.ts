import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BucketsController } from './buckets.controller';
import { BucketsService } from './buckets.service';
import { Bucket, BucketSchema } from '../../schemas/bucket.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bucket.name, schema: BucketSchema }])],
  controllers: [BucketsController],
  providers: [BucketsService],
})
export class BucketsModule {}
