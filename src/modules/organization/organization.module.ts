import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { OrganizationRepoModule } from './repository/organization-repo.module';

@Module({
  imports: [OrganizationRepoModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService, OrganizationRepoModule],
})
export class OrganizationModule {}
