import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BudgetDocument = Budget & Document;

@Schema({ _id: true, timestamps: true })
class BudgetCategory {
  @Prop({ required: true, type: Types.ObjectId, ref: 'FinanceCategory' })
  financeCategoryId: Types.ObjectId;

  @Prop({ required: true })
  targetAmount: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

@Schema({ timestamps: true, collection: 'budgets' })
export class Budget {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Account' })
  accountId: Types.ObjectId | null;

  @Prop({ required: true, index: true })
  month: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: ['income', 'expense'] })
  budgetType: string;

  @Prop({ required: true, enum: ['monthly', 'oneTime'] })
  periodType: string;

  @Prop({ default: 'active', enum: ['active', 'closed'], index: true })
  status: string;

  @Prop({ default: null })
  notes: string | null;

  @Prop({ default: null })
  customTargetAmount: number | null;

  @Prop({ type: [BudgetCategory], default: [] })
  categories: BudgetCategory[];

  @Prop({ default: null })
  closedAt: Date | null;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);

BudgetSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
