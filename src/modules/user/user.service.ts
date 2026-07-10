import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { UserRepoService } from './repository/user-repo.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepoService,
    private readonly jwtService: JwtService,
  ) { }

  async findAllUsers() {
    return this.userRepo.find({ isDeleted: false });
  }

  async register(registerDto: RegisterUserDto) {
    const existingUser = await this.userRepo.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    const rolesIds = registerDto.roles ? registerDto.roles.map(id => new Types.ObjectId(id)) : [];

    const newUser = await this.userRepo.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      roles: rolesIds,
    });

    // Remove password from returned object
    const userObject = newUser.toObject();
    delete userObject.password;
    return userObject;
  }

  async login(loginDto: LoginUserDto) {
    const user = await this.userRepo.findByEmailWithPassword(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        // Optional: you can fetch roles if you want them in the response body, 
        // but they are no longer strictly needed here since JwtStrategy fetches them!
      }
    };
  }

  async softDelete(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.update({ _id: userId }, { isDeleted: true });
    return { message: 'User deleted successfully' };
  }
}

