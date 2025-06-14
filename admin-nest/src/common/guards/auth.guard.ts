import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { pathToRegexp } from 'path-to-regexp';
import { ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private globalWhiteList = [];
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
  ) {
    super();
    this.globalWhiteList = [].concat(this.config.get('yml.permission.router.whitelist') || []);
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isInWhiteList = this.checkWhiteList(ctx);
    if (isInWhiteList) return await this.jumpActivate(ctx);

    const req = ctx.switchToHttp().getRequest();
    const accessToken = req.get('Authorization');

    console.log('accessToken', accessToken);

    if (!accessToken) throw new ForbiddenException('header中缺少Authorization字段，请重新登录');
    return await this.activate(ctx);
  }

  async activate(ctx: ExecutionContext) {
    return super.canActivate(ctx) as boolean;
  }

  /**
   * 跳过验证
   * @param ctx
   * @returns
   */
  async jumpActivate(ctx: ExecutionContext) {
    try {
      await this.activate(ctx);
    } catch (e) {
      // 未登录不做任何处理，直接返回 true
    }
    return true;
  }

  /**
   * 检查接口是否在白名单内
   * @param ctx
   * @returns
   */
  checkWhiteList(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const i = this.globalWhiteList.findIndex((route: any) => {
      if (route.method && req.method.toUpperCase() === route.method.toUpperCase()) {
        return !!pathToRegexp(route.path).exec(req.route.path);
      }
      return false;
    });
    // 在白名单内 则 进行下一步， i === -1 ，则不在白名单，需要 比对是否有当前接口权限
    return i > -1;
  }
}
