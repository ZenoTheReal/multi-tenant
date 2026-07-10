import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_GROUPS_KEY } from './role-groups.decorator';

@Injectable()
export class RoleGroupsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoleGroups = this.reflector.getAllAndOverride<string[]>(ROLE_GROUPS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoleGroups) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return false;
    }

    // Checking if the user's populated roles match any of the required role groups
    return requiredRoleGroups.some((requiredGroup) => 
      user.roles.some((r) => r.roleGroup === requiredGroup)
    );
  }
}
