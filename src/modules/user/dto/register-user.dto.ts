import { IsEmail, IsString, MinLength, IsOptional, IsArray, IsMongoId } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  roles?: string[];
}
