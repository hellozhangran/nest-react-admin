import { compareSync } from 'bcryptjs';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';



export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      usernameField: 'name',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(name: string, password: string) {
    const user = await this.userRepository.createQueryBuilder('user')
      .addSelect('user.password') // 添加密码字段，否则默认是取不出来的
      .where('user.name = :name', { name })
      .getOne();

    const user1 = await this.userRepository.findOne({ where: { name } });
      
    if (!user) {
      throw new UnauthorizedException('用户名不正确');
    }
    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException('密码不正确');
    }
    return user;
  }
}
