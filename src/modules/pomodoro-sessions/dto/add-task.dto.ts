import { IsString } from 'class-validator';

export class AddTaskDto {
  @IsString() taskId: string;
}
