import { Module } from '@nestjs/common';
import { RoleRepoModule } from './repository/role-repo.module';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [RoleRepoModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleRepoModule, RoleService], 
})
export class RoleModule {}

