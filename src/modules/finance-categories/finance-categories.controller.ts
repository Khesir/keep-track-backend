import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { FinanceCategoriesService } from './finance-categories.service';
import { CreateFinanceCategoryDto } from './dto/create-finance-category.dto';
import { UpdateFinanceCategoryDto } from './dto/update-finance-category.dto';

@Controller('finance-categories')
export class FinanceCategoriesController {
  constructor(private readonly financeCategoriesService: FinanceCategoriesService) {}

  @Get()
  findAll(
    @Req() req,
    @Query('type') type?: string,
    @Query('isArchive') isArchive?: string,
    @Query('ids') ids?: string,
  ) {
    return this.financeCategoriesService.findAll(req.user.authId, type, isArchive, ids);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.financeCategoriesService.findOne(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateFinanceCategoryDto) {
    return this.financeCategoriesService.create(req.user.authId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFinanceCategoryDto, @Req() req) {
    return this.financeCategoriesService.update(id, dto, req.user.authId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.financeCategoriesService.remove(id, req.user.authId);
  }
}
