import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MonthPlanDocument = MonthPlan & Document;

@Schema({ timestamps: true, collection: 'month_plans' })
export class MonthPlan {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Account' })
  accountId: Types.ObjectId | null;

  @Prop({ required: true })
  month: string;

  @Prop({ default: null })
  notes: string | null;

  @Prop({ type: [Types.ObjectId], ref: 'Budget', default: [] })
  budgetIds: Types.ObjectId[];
}

export const MonthPlanSchema = SchemaFactory.createForClass(MonthPlan);

MonthPlanSchema.index({ userId: 1, month: 1 }, { unique: true });

MonthPlanSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
