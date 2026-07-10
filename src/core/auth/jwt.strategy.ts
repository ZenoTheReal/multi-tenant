import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepoService } from '../../modules/user/repository/user-repo.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepo: UserRepoService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback_secret',
    });
  }

  async validate(payload: any) {
    // This payload is the decoded JWT token.
    // Fetch the full user from DB and populate their roles so guards work
    const user = await this.userRepo.findByIdWithPopulatedRoles(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('User no longer exists or is disabled');
    }

    // By returning this object, Passport attaches it to `req.user`
    return user;
  }
}

