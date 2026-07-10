import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from '../schema/organization.schema';
import { OrganizationRepoService } from './organization-repo.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]),
  ],
  providers: [OrganizationRepoService],
  exports: [OrganizationRepoService],
})
export class OrganizationRepoModule {}
