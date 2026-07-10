import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
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

  @Patch(':id/role')
  @UseGuards(AuthGuard('jwt'))
  @Roles('organizer')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Promote or demote a user role (Organizer only)' })
  @ApiOkResponse({ description: 'User role successfully updated.' })
  async updateRole(
    @Param('id') userIdToUpdate: string,
    @Body() dto: UpdateUserRoleDto,
    @Req() req: any
  ) {
    // req.user is provided by JwtStrategy
    const currentUserId = req.user.sub || req.user._id;
    const tenantId = req.user.tenantId;
    return this.userService.updateRole(userIdToUpdate, dto.role, currentUserId, tenantId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin','organizer')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a user by ID' })
  @ApiOkResponse({ description: 'User successfully soft deleted.' })
  async softDeleteUser(@Param('id') id: string) {
    return this.userService.softDelete(id);
  }
}


