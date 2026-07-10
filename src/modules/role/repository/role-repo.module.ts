import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '../schema/role.schema';
import { RoleRepoService } from './role-repo.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [RoleRepoService],
  exports: [RoleRepoService],
})
export class RoleRepoModule {}
