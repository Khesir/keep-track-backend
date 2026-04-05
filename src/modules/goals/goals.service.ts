import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Goal, GoalDocument } from '../../schemas/goal.schema';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(@InjectModel(Goal.name) private goalModel: Model<GoalDocument>) {}

  findAll(authId: string, status?: string) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (status) filter.status = status;
    return this.goalModel.find(filter);
  }

  async findOne(id: string, authId: string) {
    const doc = await this.goalModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreateGoalDto) {
    return this.goalModel.create({ ...dto, userId: new Types.ObjectId(authId) });
  }

  async update(id: string, dto: UpdateGoalDto, authId: string) {
    const doc = await this.goalModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      dto,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const result = await this.goalModel.deleteOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (result.deletedCount === 0) throw new NotFoundException();
  }

  async complete(id: string, authId: string) {
    const doc = await this.goalModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { status: 'completed', completedAt: new Date() },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }
}
