import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PomodoroSessionsController } from './pomodoro-sessions.controller';
import { PomodoroSessionsService } from './pomodoro-sessions.service';
import { PomodoroSession, PomodoroSessionSchema } from 'src/schemas/pomodoro-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PomodoroSession.name, schema: PomodoroSessionSchema },
    ]),
  ],
  controllers: [PomodoroSessionsController],
  providers: [PomodoroSessionsService],
})
export class PomodoroSessionsModule {}
