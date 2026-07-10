import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTaskDto {
  @ApiProperty({ example: '6a50c8f4c5761d6770d533d6', description: 'The Object ID of the employee to assign this task to' })
  @IsMongoId()
  assigneeId: string;
}
