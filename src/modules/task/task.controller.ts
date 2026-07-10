import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
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
  @ApiCreatedResponse({ description: 'Task successfully created.' })
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Get()
  @Roles('organizer', 'employee')
  @ApiOperation({ summary: 'Get all tasks for the current organization' })
  @ApiOkResponse({ description: 'List of all tasks.' })
  async getTasks() {
    return this.taskService.findAllTasks();
  }

  @Patch(':id/assign')
  @Roles('organizer')
  @ApiOperation({ summary: 'Assign a task to an employee (Organizer only)' })
  @ApiOkResponse({ description: 'Task successfully assigned.' })
  async assignTask(
    @Param('id') taskId: string,
    @Body() assignDto: AssignTaskDto
  ) {
    return this.taskService.assignTask(taskId, assignDto.assigneeId);
  }
}
