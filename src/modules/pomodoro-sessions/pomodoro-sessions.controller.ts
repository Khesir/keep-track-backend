import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { PomodoroSessionsService } from './pomodoro-sessions.service';
import { CreatePomodoroSessionDto } from './dto/create-pomodoro-session.dto';
import { AddTaskDto } from './dto/add-task.dto';

@Controller('pomodoro-sessions')
export class PomodoroSessionsController {
  constructor(private readonly pomodoroSessionsService: PomodoroSessionsService) {}

  @Get()
  findAll(@Req() req, @Query() query: any) {
    return this.pomodoroSessionsService.findAll(req.user.authId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.pomodoroSessionsService.findOne(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreatePomodoroSessionDto) {
    return this.pomodoroSessionsService.create(req.user.authId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.pomodoroSessionsService.remove(id, req.user.authId);
  }

  @Post(':id/pause')
  pause(@Param('id') id: string, @Req() req) {
    return this.pomodoroSessionsService.pause(id, req.user.authId);
  }

  @Post(':id/resume')
  resume(@Param('id') id: string, @Req() req) {
    return this.pomodoroSessionsService.resume(id, req.user.authId);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string, @Req() req) {
    return this.pomodoroSessionsService.complete(id, req.user.authId);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Req() req) {
    return this.pomodoroSessionsService.cancel(id, req.user.authId);
  }

  @Post(':id/tasks')
  addTask(@Param('id') id: string, @Body() dto: AddTaskDto, @Req() req) {
    return this.pomodoroSessionsService.addTask(id, dto.taskId, req.user.authId);
  }
}
