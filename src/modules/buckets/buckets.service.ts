import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBucketDto } from './dto/create-bucket.dto';
import { UpdateBucketDto } from './dto/update-bucket.dto';
import { Bucket, BucketDocument } from '../../schemas/bucket.schema';

@Injectable()
export class BucketsService {
  constructor(@InjectModel(Bucket.name) private bucketModel: Model<BucketDocument>) {}

  findAll(authId: string, isArchive?: string) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (isArchive !== undefined) filter.isArchive = isArchive === 'true';
    return this.bucketModel.find(filter);
  }

  async findOne(id: string, authId: string) {
    const doc = await this.bucketModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreateBucketDto) {
    return this.bucketModel.create({ ...dto, userId: new Types.ObjectId(authId) });
  }

  async update(id: string, dto: UpdateBucketDto, authId: string) {
    const doc = await this.bucketModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      dto,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const result = await this.bucketModel.deleteOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (result.deletedCount === 0) throw new NotFoundException();
  }
}
