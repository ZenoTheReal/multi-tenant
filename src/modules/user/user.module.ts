import { Module } from '@nestjs/common';
import { UserRepoModule } from './repository/user-repo.module';
import { OrganizationModule } from '@modules/organization/organization.module';
import { RoleRepoModule } from '@modules/role/repository/role-repo.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserRepoModule, OrganizationModule, RoleRepoModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
