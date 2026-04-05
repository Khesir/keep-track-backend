import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PomodoroSession, PomodoroSessionDocument } from 'src/schemas/pomodoro-session.schema';
import { CreatePomodoroSessionDto } from './dto/create-pomodoro-session.dto';

@Injectable()
export class PomodoroSessionsService {
  constructor(
    @InjectModel(PomodoroSession.name)
    private sessionModel: Model<PomodoroSessionDocument>,
  ) {}

  findAll(
    authId: string,
    query: { projectId?: string; status?: string; type?: string; dateFrom?: string; dateTo?: string },
  ) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (query.projectId) filter.projectId = new Types.ObjectId(query.projectId);
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;
    if (query.dateFrom || query.dateTo) {
      filter.startedAt = {};
      if (query.dateFrom) filter.startedAt.$gte = new Date(query.dateFrom);
      if (query.dateTo) filter.startedAt.$lte = new Date(query.dateTo);
    }
    return this.sessionModel.find(filter).sort({ startedAt: -1 });
  }

  async findOne(id: string, authId: string) {
    const doc = await this.sessionModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreatePomodoroSessionDto) {
    return this.sessionModel.create({
      ...dto,
      userId: new Types.ObjectId(authId),
      projectId: dto.projectId ? new Types.ObjectId(dto.projectId) : null,
      startedAt: new Date(),
      status: 'running',
    });
  }

  async remove(id: string, authId: string) {
    const result = await this.sessionModel.deleteOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (result.deletedCount === 0) throw new NotFoundException();
  }

  async pause(id: string, authId: string) {
    const session = await this.sessionModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!session) throw new NotFoundException();

    const elapsed =
      session.elapsedSecondsBeforePause +
      Math.floor((Date.now() - session.startedAt.getTime()) / 1000);

    return this.sessionModel.findByIdAndUpdate(
      id,
      { status: 'paused', pausedAt: new Date(), elapsedSecondsBeforePause: elapsed },
      { new: true },
    );
  }

  async resume(id: string, authId: string) {
    const doc = await this.sessionModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { status: 'running', pausedAt: null, startedAt: new Date() },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async complete(id: string, authId: string) {
    const doc = await this.sessionModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { status: 'completed', endedAt: new Date() },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async cancel(id: string, authId: string) {
    const doc = await this.sessionModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { status: 'canceled', endedAt: new Date() },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async addTask(id: string, taskId: string, authId: string) {
    const doc = await this.sessionModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { $addToSet: { tasksCleared: new Types.ObjectId(taskId) } },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }
}
