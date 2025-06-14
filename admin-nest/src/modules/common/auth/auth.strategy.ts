import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import {  UserEntity } from '@modules/system/user/entities/sys-user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  /**
   * 这里的构造函数向父类传递了授权时必要的参数，在实例化时，父类会得知授权时，客户端的请求必须使用 Authorization 作为请求头，
   * 而这个请求头的内容前缀也必须为 Bearer，在解码授权令牌时，使用秘钥 secretOrKey: 'secretKey' 来将授权令牌解码为创建令牌时的 payload。
   */
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    } as StrategyOptionsWithoutRequest);
  }

  async validate(payload: { userid: number; iat: Date }) {
    console.log('auth strategy validate', payload);
    const user = await this.userRepository.findOne({ where: { userId: payload.userid } });
    if (!user) throw new UnauthorizedException('登录已过期，请重新登录');
    return {
      user: user,
    };
  }
}
