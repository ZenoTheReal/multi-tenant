import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { RoleService } from './role.service';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of public roles for signup' })
  @ApiOkResponse({ description: 'List of roles excluding management roles.' })
  async getPublicRoles() {
    return this.roleService.getPublicRoles();
  }
}
