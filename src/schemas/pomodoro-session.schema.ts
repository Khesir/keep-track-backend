import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PomodoroSessionDocument = PomodoroSession & Document;

@Schema({ timestamps: true, collection: 'pomodoro_sessions' })
export class PomodoroSession {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Project' })
  projectId: Types.ObjectId | null;

  @Prop({ default: null })
  title: string | null;

  @Prop({
    required: true,
    enum: ['pomodoro', 'shortBreak', 'longBreak', 'stopwatch'],
  })
  type: string;

  @Prop({ required: true })
  durationSeconds: number;

  @Prop({ required: true, index: true })
  startedAt: Date;

  @Prop({ default: null })
  endedAt: Date | null;

  @Prop({ default: null })
  pausedAt: Date | null;

  @Prop({ default: 0 })
  elapsedSecondsBeforePause: number;

  @Prop({
    default: 'running',
    enum: ['running', 'paused', 'completed', 'canceled'],
    index: true,
  })
  status: string;

  @Prop({ type: [Types.ObjectId], ref: 'Task', default: [] })
  tasksCleared: Types.ObjectId[];
}

export const PomodoroSessionSchema = SchemaFactory.createForClass(PomodoroSession);

PomodoroSessionSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
