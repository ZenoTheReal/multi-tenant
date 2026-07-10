import { IsEmail, IsString, MinLength, IsOptional, IsArray, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'The full name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user (min 6 chars)' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiPropertyOptional({ type: [String], description: 'Optional list of Role Object IDs to assign' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  roles?: string[];
}

