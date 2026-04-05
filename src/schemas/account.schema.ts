import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true, collection: 'accounts' })
export class Account {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['cash', 'bank', 'credit', 'investment', 'savings', 'other'],
  })
  accountType: string;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ default: null })
  colorHex: string | null;

  @Prop({ default: null })
  iconCodePoint: number | null;

  @Prop({ default: null })
  bankAccountNumber: string | null;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false, index: true })
  isArchived: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
