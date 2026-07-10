import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    UserModule, 
    RoleModule,
    RouterModule.register([
      {
        path: 'api',
        children: [UserModule, RoleModule],
      },
    ]),
  ],
  exports: [UserModule, RoleModule],
})
export class ModulesModule {}
