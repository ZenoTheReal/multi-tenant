import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { taskModelProvider } from './task.provider';

@Module({
  controllers: [TaskController],
  providers: [TaskService, taskModelProvider],
  exports: [TaskService],
})
export class TaskModule {}
