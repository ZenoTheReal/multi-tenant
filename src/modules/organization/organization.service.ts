import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepoService } from './repository/organization-repo.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly orgRepo: OrganizationRepoService) {}

  async getOrganizationByCode(orgCode: string) {
    const org = await this.orgRepo.findByOrgCode(orgCode);
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return org;
  }

  async getOrganizationByTenantId(tenantId: string) {
    const org = await this.orgRepo.findByTenantId(tenantId);
    if (!org) {
      throw new NotFoundException('Organization not found for this tenant');
    }
    return org;
  }

  async createOrganization(name: string, tenantId: string, ownerId: any) {
    return this.orgRepo.create({
      name,
      tenantId,
      ownerId,
    });
  }
}
