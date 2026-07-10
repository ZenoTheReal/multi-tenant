import { Injectable } from '@nestjs/common';
import { UserRepoService } from './repository/user-repo.service';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepoService) {}

  async findAllUsers() {
    return this.userRepo.find({});
  }
}
