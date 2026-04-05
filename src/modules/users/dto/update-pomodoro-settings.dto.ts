import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdatePomodoroSettingsDto {
  @IsOptional() @IsNumber() @Min(1) pomodoroDuration?: number;
  @IsOptional() @IsNumber() @Min(1) shortBreakDuration?: number;
  @IsOptional() @IsNumber() @Min(1) longBreakDuration?: number;
  @IsOptional() @IsNumber() @Min(1) sessionsUntilLongBreak?: number;
}
