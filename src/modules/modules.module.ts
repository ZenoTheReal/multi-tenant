import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { OrganizationModule } from './organization/organization.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    UserModule, 
    RoleModule,
    OrganizationModule,
    TaskModule,
    RouterModule.register([
      {
        path: 'api',
        children: [UserModule, RoleModule, OrganizationModule, TaskModule],
      },
    ]),
  ],
  exports: [UserModule, RoleModule, OrganizationModule, TaskModule],
})
export class ModulesModule {}
