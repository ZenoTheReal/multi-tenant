import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { UserRepoService } from './repository/user-repo.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { OrganizationService } from '../organization/organization.service';
import { RoleRepoService } from '../role/repository/role-repo.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepoService,
    private readonly jwtService: JwtService,
    private readonly orgService: OrganizationService,
    private readonly roleRepo: RoleRepoService,
  ) { }

  async findAllUsers() {
    return this.userRepo.find({ isDeleted: false });
  }

  async register(registerDto: RegisterUserDto) {
    if (!registerDto.organizationName && !registerDto.orgCode) {
      throw new BadRequestException('Either organizationName or orgCode must be provided');
    }

    if (registerDto.organizationName && registerDto.orgCode) {
      throw new BadRequestException('Provide either organizationName or orgCode, not both');
    }

    const existingUser = await this.userRepo.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    let tenantId: string | undefined = undefined;
    let assignedRoleId: Types.ObjectId | null = null;
    const isOrganizer = !!registerDto.organizationName;

    if (isOrganizer) {
      const role = await this.roleRepo.findOne({ role: 'organizer' });
      if (!role) throw new NotFoundException('Organizer role not found in DB');
      assignedRoleId = role._id;
    } else {
      const role = await this.roleRepo.findOne({ role: 'employee' });
      if (!role) throw new NotFoundException('Employee role not found in DB');
      assignedRoleId = role._id;

      const org = await this.orgService.getOrganizationByCode(registerDto.orgCode!);
      tenantId = org.tenantId;
    }

    const createPayload: any = {
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      roles: [assignedRoleId],
    };
    if (tenantId) {
      createPayload.tenantId = tenantId;
    }

    const newUser = await this.userRepo.create(createPayload);

    if (isOrganizer) {
      await this.orgService.createOrganization(registerDto.organizationName!, newUser.tenantId, newUser._id);
    }

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

  async updateRole(userIdToUpdate: string, newRoleName: string, currentUserId: string, tenantId: string) {
    // Ensure the target user exists and belongs to the same tenant
    const targetUser = await this.userRepo.findById(userIdToUpdate);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }
    if (targetUser.tenantId !== tenantId) {
      throw new UnauthorizedException('You can only update users within your organization');
    }

    // Get the organization to check owner rules
    const org = await this.orgService.getOrganizationByTenantId(tenantId);
    
    // The creator (owner) cannot be demoted (e.g. to employee)
    if (org.ownerId.toString() === userIdToUpdate && newRoleName !== 'organizer') {
      throw new BadRequestException('The organization creator cannot be demoted');
    }

    // Get the role ID
    const role = await this.roleRepo.findOne({ role: newRoleName });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Update the user's role
    await this.userRepo.update({ _id: userIdToUpdate }, { roles: [role._id] });
    return { message: `User role successfully updated to ${newRoleName}` };
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

