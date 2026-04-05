import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true, collection: 'tasks' })
export class Task {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Project', index: true })
  projectId: Types.ObjectId | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Task', index: true })
  parentTaskId: Types.ObjectId | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Bucket' })
  bucketId: Types.ObjectId | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'FinanceCategory' })
  financeCategoryId: Types.ObjectId | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Transaction' })
  actualTransactionId: Types.ObjectId | null;

  @Prop({ required: true })
  title: string;

  @Prop({ default: null })
  description: string | null;

  @Prop({
    default: 'todo',
    enum: ['todo', 'inProgress', 'completed', 'cancelled'],
    index: true,
  })
  status: string;

  @Prop({
    default: 'medium',
    enum: ['low', 'medium', 'high', 'urgent'],
    index: true,
  })
  priority: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: null, index: true })
  dueDate: Date | null;

  @Prop({ default: null })
  completedAt: Date | null;

  @Prop({ default: false })
  archived: boolean;

  @Prop({ default: false })
  isMoneyRelated: boolean;

  @Prop({ default: null })
  expectedAmount: number | null;

  @Prop({ default: null, enum: ['income', 'expense', null] })
  transactionType: string | null;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
