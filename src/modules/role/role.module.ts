import { Module } from '@nestjs/common';
import { RoleRepoModule } from './repository/role-repo.module';

@Module({
  imports: [RoleRepoModule],
  // Export RoleRepoModule so other modules (like Auth or User) can access the Role repository if needed
  exports: [RoleRepoModule], 
})
export class RoleModule {}
