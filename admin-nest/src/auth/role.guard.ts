import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService
) {}

  canActivate(context: ExecutionContext) {
    // 获取路由角色
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false;
    }

    // 判断用户角色是否在路由角色中
    const hasRole = roles.includes(user.role);
    return hasRole;
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);