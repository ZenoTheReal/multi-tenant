import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { Roles } from '@common';

@ApiTags('Task')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles('organizer')
  @ApiOperation({ summary: 'Create a new task (Organizer only)' })
  async createTask(@Body() createTaskDto: any) {
    return this.taskService.createTask(createTaskDto);
  }

  @Get()
  @Roles('organizer', 'employee')
  @ApiOperation({ summary: 'Get all tasks for the current organization' })
  async getTasks() {
    return this.taskService.findAllTasks();
  }
}
