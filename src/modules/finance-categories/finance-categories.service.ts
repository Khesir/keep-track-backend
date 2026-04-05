import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FinanceCategory, FinanceCategoryDocument } from '../../schemas/finance-category.schema';
import { CreateFinanceCategoryDto } from './dto/create-finance-category.dto';
import { UpdateFinanceCategoryDto } from './dto/update-finance-category.dto';

@Injectable()
export class FinanceCategoriesService {
  constructor(
    @InjectModel(FinanceCategory.name)
    private categoryModel: Model<FinanceCategoryDocument>,
  ) {}

  findAll(authId: string, type?: string, isArchive?: string, ids?: string) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (type) filter.type = type;
    if (isArchive !== undefined) filter.isArchive = isArchive === 'true';
    if (ids) {
      const idList = ids.split(',').map((id) => new Types.ObjectId(id.trim()));
      filter._id = { $in: idList };
    }
    return this.categoryModel.find(filter);
  }

  async findOne(id: string, authId: string) {
    const doc = await this.categoryModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreateFinanceCategoryDto) {
    return this.categoryModel.create({ ...dto, userId: new Types.ObjectId(authId) });
  }

  async update(id: string, dto: UpdateFinanceCategoryDto, authId: string) {
    const doc = await this.categoryModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      dto,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const result = await this.categoryModel.deleteOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (result.deletedCount === 0) throw new NotFoundException();
  }
}
