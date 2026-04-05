import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FinanceCategoryDocument = FinanceCategory & Document;

@Schema({ timestamps: true, collection: 'finance_categories' })
export class FinanceCategory {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['income', 'expense', 'investment', 'savings', 'transfer'],
    index: true,
  })
  type: string;

  @Prop({ default: false })
  isArchive: boolean;
}

export const FinanceCategorySchema = SchemaFactory.createForClass(FinanceCategory);

FinanceCategorySchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
