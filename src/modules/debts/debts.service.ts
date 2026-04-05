import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { Debt, DebtDocument } from 'src/schemas/debt.schema';

@Injectable()
export class DebtsService {
  constructor(@InjectModel(Debt.name) private debtModel: Model<DebtDocument>) {}

  findAll(authId: string, type?: string, status?: string) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (type) filter.type = type;
    if (status) filter.status = status;
    return this.debtModel.find(filter);
  }

  async findOne(id: string, authId: string) {
    const doc = await this.debtModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreateDebtDto) {
    return this.debtModel.create({
      ...dto,
      userId: new Types.ObjectId(authId),
      accountId: dto.accountId ? new Types.ObjectId(dto.accountId) : null,
      transactionId: dto.transactionId ? new Types.ObjectId(dto.transactionId) : null,
    });
  }

  async update(id: string, dto: UpdateDebtDto, authId: string) {
    const doc = await this.debtModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      dto,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const result = await this.debtModel.deleteOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (result.deletedCount === 0) throw new NotFoundException();
  }

  async settle(id: string, authId: string) {
    const doc = await this.debtModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { status: 'settled', remainingAmount: 0, settledAt: new Date() },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }
}
