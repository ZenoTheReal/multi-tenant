import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ example: 'organizer', description: 'The new role for the user', enum: ['organizer', 'employee'] })
  @IsString()
  @IsIn(['organizer', 'employee'])
  role: string;
}
