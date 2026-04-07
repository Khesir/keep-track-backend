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
    const userId = new Types.ObjectId(authId);
    const doc = await this.monthPlanModel.findOne({ _id: id, userId });
    if (!doc) throw new NotFoundException();

    if (includeBudgets) {
      // Delete all budgets for this month by month key — more reliable than
      // relying on budgetIds which may lag if a budget was created outside this plan
      await this.budgetModel.deleteMany({ userId, month: doc.month });
    }

    await doc.deleteOne();
  }

  async addBudget(id: string, budgetId: string, authId: string) {
    const doc = await this.monthPlanModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { $addToSet: { budgetIds: new Types.ObjectId(budgetId) } },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
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
