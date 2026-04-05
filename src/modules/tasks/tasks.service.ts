import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from 'src/schemas/task.schema';
import { Transaction, TransactionDocument } from 'src/schemas/transaction.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  findAll(
    authId: string,
    query: {
      projectId?: string;
      bucketId?: string;
      status?: string;
      priority?: string;
      parentTaskId?: string;
      archived?: string;
      isMoneyRelated?: string;
      dueBefore?: string;
    },
  ) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (query.projectId) filter.projectId = new Types.ObjectId(query.projectId);
    if (query.bucketId) filter.bucketId = new Types.ObjectId(query.bucketId);
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.archived !== undefined) filter.archived = query.archived === 'true';
    if (query.isMoneyRelated !== undefined)
      filter.isMoneyRelated = query.isMoneyRelated === 'true';
    if (query.parentTaskId === 'null') filter.parentTaskId = null;
    else if (query.parentTaskId)
      filter.parentTaskId = new Types.ObjectId(query.parentTaskId);
    if (query.dueBefore) filter.dueDate = { $lte: new Date(query.dueBefore) };
    return this.taskModel.find(filter);
  }

  async findOne(id: string, authId: string) {
    const doc = await this.taskModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  findSubtasks(id: string, authId: string) {
    return this.taskModel.find({ parentTaskId: new Types.ObjectId(id), userId: new Types.ObjectId(authId) });
  }

  create(authId: string, dto: CreateTaskDto) {
    return this.taskModel.create({
      ...dto,
      userId: new Types.ObjectId(authId),
      projectId: dto.projectId ? new Types.ObjectId(dto.projectId) : null,
      parentTaskId: dto.parentTaskId ? new Types.ObjectId(dto.parentTaskId) : null,
      bucketId: dto.bucketId ? new Types.ObjectId(dto.bucketId) : null,
      financeCategoryId: dto.financeCategoryId ? new Types.ObjectId(dto.financeCategoryId) : null,
    });
  }

  async update(id: string, dto: UpdateTaskDto, authId: string) {
    const doc = await this.taskModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      dto,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const doc = await this.taskModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { archived: true },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async complete(id: string, dto: CompleteTaskDto, authId: string) {
    const task = await this.taskModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!task) throw new NotFoundException();

    const updates: any = { status: 'completed', completedAt: new Date() };

    if (dto.createTransaction && dto.accountId && dto.actualAmount != null) {
      const txn = await this.transactionModel.create({
        userId: new Types.ObjectId(authId),
        accountId: new Types.ObjectId(dto.accountId),
        amount: dto.actualAmount,
        type: task.transactionType ?? 'expense',
        description: task.title,
        date: dto.transactionDate ? new Date(dto.transactionDate) : new Date(),
        financeCategoryId: task.financeCategoryId,
      });
      updates.actualTransactionId = txn._id;
    }

    return this.taskModel.findByIdAndUpdate(id, updates, { new: true });
  }
}
