import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Roles } from '@common';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User successfully registered.' })
  async register(@Body() registerDto: RegisterUserDto) {
    return this.userService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT token' })
  @ApiOkResponse({ description: 'User successfully logged in.' })
  async login(@Body() loginDto: LoginUserDto) {
    return this.userService.login(loginDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active users' })
  @ApiOkResponse({ description: 'List of all users.' })
  async getAllUsers() {
    return this.userService.findAllUsers();
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin','user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a user by ID' })
  @ApiOkResponse({ description: 'User successfully soft deleted.' })
  async softDeleteUser(@Param('id') id: string) {
    return this.userService.softDelete(id);
  }
}


