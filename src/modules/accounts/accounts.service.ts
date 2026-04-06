import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountDocument } from '../../schemas/account.schema';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  findAll(authId: string, isArchived?: string, accountType?: string) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (isArchived !== undefined) filter.isArchived = isArchived === 'true';
    if (accountType) filter.accountType = accountType;
    return this.accountModel.find(filter);
  }

  async findOne(id: string, authId: string) {
    const doc = await this.accountModel.findOne({
      _id: id,
      userId: new Types.ObjectId(authId),
    });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreateAccountDto) {
    return this.accountModel.create({ ...dto, userId: new Types.ObjectId(authId) });
  }

  async update(id: string, dto: UpdateAccountDto, authId: string) {
    const doc = await this.accountModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      dto,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const result = await this.accountModel.deleteOne({
      _id: id,
      userId: new Types.ObjectId(authId),
    });
    if (result.deletedCount === 0) throw new NotFoundException();
  }
}
