import { IsString, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete Onboarding', description: 'The title of the task' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Read through the company handbook', description: 'Detailed description of the task' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '6a50c8f4c5761d6770d533d6', description: 'The Object ID of the user to assign the task to' })
  @IsOptional()
  @IsMongoId()
  assigneeId?: string;
}
