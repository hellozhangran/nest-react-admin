import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, UpdateUserDto, ListUserDto, ChangeStatusDto, ResetPwdDto, AllocatedListDto, UpdateProfileDto, UpdatePwdDto } from './dto/index';

import { UserEntity } from './entities/sys-user.entity';
import { SysUserWithPostEntity } from './entities/user-with-post.entity';
import { SysUserWithRoleEntity } from './entities/user-with-role.entity';
import * as bcrypt from 'bcryptjs';

import { UserDto } from './user.decorator';
import { SYS_USER_TYPE } from 'src/common/constant';
import { UserType } from './dto/user.dto';


@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(SysUserWithPostEntity)
    private readonly sysUserWithPostEntityRep: Repository<SysUserWithPostEntity>,
    @InjectRepository(SysUserWithRoleEntity)
    private readonly sysUserWithRoleEntityRep: Repository<SysUserWithRoleEntity>,
  ) {}
  /**
   * 后台创建用户
   */
  async create(createUserDto: CreateUserDto) {
    const salt = bcrypt.genSaltSync(10);
    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hashSync(createUserDto.password, salt);
    }

    const res = await this.userRepo.save({ ...createUserDto, userType: SYS_USER_TYPE.CUSTOM });
    const postEntity = this.sysUserWithPostEntityRep.createQueryBuilder('postEntity');
    const postValues = createUserDto.postIds?.map((id) => {
      return {
        userId: res.userId,
        postId: id,
      };
    }) || [];
    postEntity.insert().values(postValues).execute();

    const roleEntity = this.sysUserWithRoleEntityRep.createQueryBuilder('roleEntity');
    const roleValues = createUserDto.roleIds?.map((id) => {
      return {
        userId: res.userId,
        roleId: id,
      };
    }) || [];
    roleEntity.insert().values(roleValues).execute();
    return res;
  }

  /**
   * 用户列表
   */
  async findAll(query: ListUserDto, user?: UserType['user']) {
    const entity = this.userRepo.createQueryBuilder('user');
    entity.where('user.delFlag = :delFlag', { delFlag: '0' });


    if (query.userName) {
      entity.andWhere(`user.userName LIKE "%${query.userName}%"`);
    }

    if (query.phonenumber) {
      entity.andWhere(`user.phonenumber LIKE "%${query.phonenumber}%"`);
    }

    if (query.status) {
      entity.andWhere('user.status = :status', { status: query.status });
    }

    if (query.params?.beginTime && query.params?.endTime) {
      entity.andWhere('user.createTime BETWEEN :start AND :end', { start: query.params.beginTime, end: query.params.endTime });
    }

    if (query.pageSize && query.pageNum) {
      entity.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    }
    

    const [list, total] = await entity.getManyAndCount();

    return {
      list,
      total,
    };
  }

  /**
   * 个人中心-用户信息
   */
  async profile(user) {
    
  }

  /**
   * 个人中心-用户信息
   */
  async updateProfile(user: UserType, updateProfileDto: UpdateProfileDto) {
    await this.userRepo.update({ userId: 1 }, updateProfileDto);
    return "ok";
  }

}
