import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from '../../schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  findAll(authId: string, status?: string, isArchived?: string, bucketId?: string) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (status) filter.status = status;
    if (isArchived !== undefined) filter.isArchived = isArchived === 'true';
    if (bucketId) filter.bucketId = new Types.ObjectId(bucketId);
    return this.projectModel.find(filter);
  }

  async findOne(id: string, authId: string) {
    const doc = await this.projectModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreateProjectDto) {
    return this.projectModel.create({
      ...dto,
      userId: new Types.ObjectId(authId),
      bucketId: dto.bucketId ? new Types.ObjectId(dto.bucketId) : null,
    });
  }

  async update(id: string, dto: UpdateProjectDto, authId: string) {
    const update: any = { ...dto };
    if (dto.bucketId) update.bucketId = new Types.ObjectId(dto.bucketId);
    const doc = await this.projectModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      update,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const result = await this.projectModel.deleteOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (result.deletedCount === 0) throw new NotFoundException();
  }
}
