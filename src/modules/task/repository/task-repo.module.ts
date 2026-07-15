import { Module } from '@nestjs/common';
import { taskModelProvider } from '../task.provider';
import { TaskRepoService } from './task-repo.service';

@Module({
  providers: [taskModelProvider, TaskRepoService],
  exports: [TaskRepoService, taskModelProvider],
})
export class TaskRepoModule {}
