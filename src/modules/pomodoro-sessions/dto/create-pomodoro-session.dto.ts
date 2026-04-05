import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePomodoroSessionDto {
  @IsEnum(['pomodoro', 'shortBreak', 'longBreak', 'stopwatch']) type: string;
  @IsNumber() durationSeconds: number;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() projectId?: string;
}
