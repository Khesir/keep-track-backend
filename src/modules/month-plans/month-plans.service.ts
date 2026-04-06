import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MonthPlan, MonthPlanDocument } from '../../schemas/month-plan.schema';
import { Budget, BudgetDocument } from '../../schemas/budget.schema';
import { CreateMonthPlanDto } from './dto/create-month-plan.dto';
import { UpdateMonthPlanDto } from './dto/update-month-plan.dto';

@Injectable()
export class MonthPlansService {
  constructor(
    @InjectModel(MonthPlan.name) private monthPlanModel: Model<MonthPlanDocument>,
    @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>,
  ) {}

  findAll(authId: string, month?: string) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (month) filter.month = month;
    return this.monthPlanModel.find(filter);
  }

  async findOne(id: string, authId: string) {
    const doc = await this.monthPlanModel
      .findOne({ _id: id, userId: new Types.ObjectId(authId) })
      .populate('budgetIds');
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async findByMonth(month: string, authId: string) {
    const doc = await this.monthPlanModel
      .findOne({ month, userId: new Types.ObjectId(authId) })
      .populate('budgetIds');
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreateMonthPlanDto) {
    return this.monthPlanModel.create({
      ...dto,
      userId: new Types.ObjectId(authId),
      accountId: dto.accountId ? new Types.ObjectId(dto.accountId) : null,
      budgetIds: (dto.budgetIds ?? []).map((id) => new Types.ObjectId(id)),
    });
  }

  async update(id: string, dto: UpdateMonthPlanDto, authId: string) {
    const update: any = { ...dto };
    if (dto.budgetIds) update.budgetIds = dto.budgetIds.map((id) => new Types.ObjectId(id));
    const doc = await this.monthPlanModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      update,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string, includeBudgets = false) {
    const doc = await this.monthPlanModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException();

    if (includeBudgets && doc.budgetIds?.length) {
      await this.budgetModel.deleteMany({ _id: { $in: doc.budgetIds } });
    }

    await doc.deleteOne();
  }

  async copy(sourceMonth: string, targetMonth: string, authId: string) {
    const userId = new Types.ObjectId(authId);
    const source = await this.monthPlanModel.findOne({ month: sourceMonth, userId });
    if (!source) throw new NotFoundException(`No month plan found for ${sourceMonth}`);

    const existing = await this.monthPlanModel.findOne({ month: targetMonth, userId });
    if (existing) throw new ConflictException(`Month plan for ${targetMonth} already exists`);

    return this.monthPlanModel.create({
      userId,
      accountId: source.accountId,
      month: targetMonth,
      notes: source.notes,
      budgetIds: [],
    });
  }
}
