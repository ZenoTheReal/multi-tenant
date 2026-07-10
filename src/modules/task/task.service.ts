import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Task } from './schema/task.schema';
import { TASK_MODEL } from './task.provider';

@Injectable()
export class TaskService {
  constructor(@Inject(TASK_MODEL) private readonly taskModel: Model<Task>) {}

  async createTask(createDto: any) {
    const createdTask = new this.taskModel(createDto);
    return createdTask.save();
  }

  async findAllTasks() {
    return this.taskModel.find().exec();
  }
}
