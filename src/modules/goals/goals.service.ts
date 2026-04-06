import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Goal, GoalDocument } from '../../schemas/goal.schema';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Transaction, TransactionDocument } from '../../schemas/transaction.schema';
import { ContributeGoalDto } from './dto/contribute-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(Goal.name) private goalModel: Model<GoalDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

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

  async contribute(id: string, dto: ContributeGoalDto, authId: string) {
    const userId = new Types.ObjectId(authId);
    const goal = await this.goalModel.findOne({ _id: id, userId });
    if (!goal) throw new NotFoundException();

    const newAmount = goal.currentAmount + dto.amount;
    const isCompleted = newAmount >= goal.targetAmount;

    await this.transactionModel.create({
      userId,
      accountId: new Types.ObjectId(dto.accountId),
      amount: dto.amount,
      type: 'expense',
      description: `Goal: ${goal.name}`,
      date: new Date(),
      notes: dto.notes ?? null,
      fee: dto.fee ?? 0,
      goalId: goal._id,
    });

    const doc = await this.goalModel.findByIdAndUpdate(
      id,
      {
        currentAmount: newAmount,
        ...(isCompleted ? { status: 'completed', completedAt: new Date() } : {}),
      },
      { new: true },
    );
    return doc;
  }
}
