import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true, collection: 'projects' })
export class Project {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Bucket' })
  bucketId: Types.ObjectId | null;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  description: string | null;

  @Prop({ default: null })
  color: string | null;

  @Prop({ default: 'active', enum: ['active', 'postponed', 'closed'], index: true })
  status: string;

  @Prop({ default: false, index: true })
  isArchived: boolean;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
