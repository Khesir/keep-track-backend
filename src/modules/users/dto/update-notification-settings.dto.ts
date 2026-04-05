import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateNotificationSettingsDto {
  @IsOptional() @IsBoolean() financeReminderEnabled?: boolean;
  @IsOptional() @IsString() financeReminderTime?: string | null;
  @IsOptional() @IsBoolean() morningReminderEnabled?: boolean;
  @IsOptional() @IsString() morningReminderTime?: string | null;
  @IsOptional() @IsBoolean() eveningReminderEnabled?: boolean;
  @IsOptional() @IsString() eveningReminderTime?: string | null;
  @IsOptional() @IsBoolean() taskDueReminderEnabled?: boolean;
  @IsOptional()
  @IsEnum(['thirtyMinutes', 'oneHour', 'twoHours', 'oneDay'])
  taskDueReminderDuration?: string;
  @IsOptional() @IsBoolean() pomodoroNotificationsEnabled?: boolean;
}
