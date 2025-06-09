import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, UpdateUserDto, ListUserDto, ChangeStatusDto, ResetPwdDto, AllocatedListDto, UpdateProfileDto, UpdatePwdDto } from './dto/index';

import { UserEntity } from './entities/sys-user.entity';
import { SysUserWithPostEntity } from './entities/user-with-post.entity';
import { SysUserWithRoleEntity } from './entities/user-with-role.entity';

import { UserDto } from './user.decorator';


@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}
  /**
   * 后台创建用户
   */
  async create(createUserDto: CreateUserDto) {

  }

  /**
   * 用户列表
   */
  async findAll(query: ListUserDto, user: UserDto['user']) {
   
  }

  /**
   * 更新用户
   */
  async update(updateUserDto: UpdateUserDto, userId: number) {
    
  }

  /**
   * 从数据声明生成令牌
   */
  createToken(payload: { uuid: string; userId: number }): string {
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  /**
   * 从令牌中获取数据声明
   */
  parseToken(token: string) {
    try {
      if (!token) return null;
      const payload = this.jwtService.verify(token.replace('Bearer ', ''));
      return payload;
    } catch (error) {
      return null;
    }
  }

  /**
   * 修改用户状态
   */
  async changeStatus(changeStatusDto: ChangeStatusDto) {

  }

  /**
   * 个人中心-用户信息
   */
  async profile(user) {
    
  }

  /**
   * 个人中心-用户信息
   */
  async updateProfile(user: UserDto, updateProfileDto: UpdateProfileDto) {}

  /**
   * 个人中心-修改密码
   */
  async updatePwd(user: UserDto, updatePwdDto: UpdatePwdDto) {}

}
