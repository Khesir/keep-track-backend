import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BucketDocument = Bucket & Document;

@Schema({ timestamps: true, collection: 'buckets' })
export class Bucket {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isArchive: boolean;
}

export const BucketSchema = SchemaFactory.createForClass(Bucket);

BucketSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
