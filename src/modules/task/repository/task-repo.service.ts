import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { BaseRepository } from '@common';
import { Task } from '../schema/task.schema';
import { TASK_MODEL } from '../task.provider';

@Injectable()
export class TaskRepoService extends BaseRepository<Task> {
  constructor(@Inject(TASK_MODEL) private readonly taskModel: Model<Task>) {
    super(taskModel);
  }
}
