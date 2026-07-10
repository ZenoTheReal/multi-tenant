import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '@common';
import { Organization } from '../schema/organization.schema';

@Injectable()
export class OrganizationRepoService extends BaseRepository<Organization> {
  constructor(@InjectModel(Organization.name) private readonly orgModel: Model<Organization>) {
    super(orgModel);
  }

  async findByOrgCode(orgCode: string): Promise<Organization | null> {
    return this.orgModel.findOne({ orgCode, isDeleted: false }).exec();
  }

  async findByTenantId(tenantId: string): Promise<Organization | null> {
    return this.orgModel.findOne({ tenantId, isDeleted: false }).exec();
  }
}
