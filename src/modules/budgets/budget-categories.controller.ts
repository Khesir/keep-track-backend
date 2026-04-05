import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetCategoryFlatDto } from './dto/create-budget-category-flat.dto';
import { UpdateBudgetCategoryDto } from './dto/budget-category.dto';

@Controller('budget-categories')
export class BudgetCategoriesController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  findAll(@Req() req, @Query('budgetId') budgetId: string) {
    return this.budgetsService.findCategoriesByBudgetId(budgetId, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateBudgetCategoryFlatDto) {
    return this.budgetsService.createCategoryFlat(dto, req.user.authId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBudgetCategoryDto, @Req() req) {
    return this.budgetsService.updateCategoryByIdFlat(id, dto, req.user.authId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.budgetsService.removeCategoryByIdFlat(id, req.user.authId);
  }

  @Delete()
  removeByBudget(@Query('budgetId') budgetId: string, @Req() req) {
    return this.budgetsService.removeCategoriesByBudgetIdFlat(budgetId, req.user.authId);
  }
}
