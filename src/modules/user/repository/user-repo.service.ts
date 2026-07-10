import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '@common';
import { User } from '../schema/user.schema';

@Injectable()
export class UserRepoService extends BaseRepository<User> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super(userModel);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userModel.findOne({ email, isDeleted: false }).select('+password').exec();
  }

  async findByIdWithPopulatedRoles(id: string): Promise<User | null> {
    return this.userModel.findOne({ _id: id, isDeleted: false }).populate('roles').exec();
  }
}
