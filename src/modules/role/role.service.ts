import { Injectable } from '@nestjs/common';
import { RoleRepoService } from './repository/role-repo.service';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepoService) {}

  async getPublicRoles() {
    return this.roleRepo.find({ roleGroup: { $ne: 'management' } });
  }
}
