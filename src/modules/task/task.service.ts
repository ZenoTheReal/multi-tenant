import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Task } from './schema/task.schema';
import { TASK_MODEL } from './task.provider';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(@Inject(TASK_MODEL) private readonly taskModel: Model<Task>) {}

  async createTask(createDto: CreateTaskDto) {
    const createdTask = new this.taskModel(createDto);
    return createdTask.save();
  }

  async findAllTasks() {
    return this.taskModel.find().exec();
  }

  async assignTask(taskId: string, assigneeId: string) {
    const task = await this.taskModel.findByIdAndUpdate(
      taskId,
      { assigneeId },
      { new: true }
    );
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
}
