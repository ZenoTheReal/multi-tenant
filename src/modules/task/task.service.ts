import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepoService } from './repository/task-repo.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepo: TaskRepoService) {}

  async createTask(createDto: CreateTaskDto) {
    return this.taskRepo.create(createDto as any);
  }

  async findAllTasks() {
    return this.taskRepo.find();
  }

  async assignTask(taskId: string, assigneeId: string) {
    const task = await this.taskRepo.update(
      { _id: taskId },
      { assigneeId }
    );
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
}
