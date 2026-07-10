import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Get(':orgCode')
  @ApiOperation({ summary: 'Get organization details by code (for validation during signup)' })
  @ApiOkResponse({ description: 'Organization details returned successfully.' })
  async getOrganizationByCode(@Param('orgCode') orgCode: string) {
    return this.orgService.getOrganizationByCode(orgCode);
  }
}
