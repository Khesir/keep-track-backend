import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() req, @Query() query: any) {
    return this.tasksService.findAll(req.user.authId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.tasksService.findOne(id, req.user.authId);
  }

  @Get(':id/subtasks')
  findSubtasks(@Param('id') id: string, @Req() req) {
    return this.tasksService.findSubtasks(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user.authId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Req() req) {
    return this.tasksService.update(id, dto, req.user.authId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.tasksService.remove(id, req.user.authId);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string, @Body() dto: CompleteTaskDto, @Req() req) {
    return this.tasksService.complete(id, dto, req.user.authId);
  }
}
