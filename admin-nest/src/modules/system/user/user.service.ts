import { In, Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, UpdateUserDto, ListUserDto, ChangeStatusDto, ResetPwdDto, AllocatedListDto, UpdateProfileDto, UpdatePwdDto, LoginDto } from './dto/index';

import { UserEntity } from './entities/sys-user.entity';
import { SysUserWithPostEntity } from './entities/user-with-post.entity';
import { SysUserWithRoleEntity } from './entities/user-with-role.entity';
import * as bcrypt from 'bcryptjs';

import { UserDto } from './user.decorator';
import { LOGIN_TOKEN_EXPIRESIN, SYS_USER_TYPE } from 'src/common/constant';
import { UserType } from './dto/user.dto';
import { ClientInfoDto } from '@/common/decorators/client.decorator';
import { CacheEnum, DelFlagEnum, StatusEnum } from '@/common/enum';
import { HttpExceptions } from '@/common/utils/http-exceptions';
import { GenerateUUID, Uniq } from '@/common/utils';
import { SysDeptEntity } from '../dept/entities/dept.entity';
import { SysRoleEntity } from '../role/entities/role.entity';
import { SysPostEntity } from '../post/entities/post.entity';
import { RedisService } from '@/modules/common/redis/redis.service';


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
    @InjectRepository(SysDeptEntity)
    private readonly sysDeptEntityRep: Repository<SysDeptEntity>,
    @InjectRepository(SysRoleEntity)
    private readonly sysRoleEntityRep: Repository<SysRoleEntity>,
    @InjectRepository(SysPostEntity)
    private readonly sysPostEntityRep: Repository<SysPostEntity>,
    private readonly redisService: RedisService,
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

  /**
   * 登录
   * @param user 
   * @param clientInfo 
   */
  async login(user: LoginDto, clientInfo: ClientInfoDto) {
    console.log(' service login');
    const data = await this.userRepo.findOne({
      where: {
        userName: user.userName,
      },
      select: ['userId', 'password'],
    });

    if (!(data && bcrypt.compareSync(user.password, data.password))) {
      return HttpExceptions.user.unauthorized('帐号或密码错误');
    }

    const userData = await this.getUserinfo(data.userId);

    if (userData.delFlag === DelFlagEnum.DELETE) {
      return HttpExceptions.user.disabled('您已被禁用，如需正常使用请联系管理员');
    }
    if (userData.status === StatusEnum.STOP) {
      return HttpExceptions.user.disabled('您已被停用，如需正常使用请联系管理员');
    }

    /**
     * 更新用户登录信息
     */
    const loginDate = new Date();
    await this.userRepo.update(
      {
        userId: data.userId,
      },
      {
        loginDate: loginDate,
        loginIp: clientInfo.ipaddr,
      },
    );

    const uuid = GenerateUUID();
    const token = this.createToken({ uuid: uuid, userId: userData.userId });
    const deptData = await this.sysDeptEntityRep.findOne({
      where: {
        deptId: userData.deptId,
      },
      select: ['deptName'],
    });

    userData['deptName'] = deptData?.deptName || '';
    const roles = userData.roles.map((item) => item.roleKey);

    const userInfo = {
      browser: clientInfo.browser,
      ipaddr: clientInfo.ipaddr,
      loginLocation: clientInfo.loginLocation,
      loginTime: loginDate,
      os: clientInfo.os,
      roles: roles,
      token: uuid,
      user: userData,
      userId: userData.userId,
      userName: userData.userName,
      deptId: userData.deptId,
    };

    await this.updateRedisToken(uuid, userInfo);

    return {
      token: token,
      message: '登录成功',
    }
  }

  async updateRedisToken(uuid: string, metaData: Partial<UserType>) {
    const oldMetaData = await this.redisService.get(`${CacheEnum.LOGIN_TOKEN_KEY}${uuid}`);

    let newMetaData = metaData;
    if (oldMetaData) {
      newMetaData = Object.assign(oldMetaData, metaData);
    }

    await this.redisService.set(`${CacheEnum.LOGIN_TOKEN_KEY}${uuid}`, newMetaData, LOGIN_TOKEN_EXPIRESIN);
  }

  /**
   * 创建 token
   */
  createToken(payload: { uuid: string; userId: number }): string {
    /**
     * 这里故意不设置 token 过期时间：
     * jwt token对过期处理的能力过于局限，只能处理被动过期，如只能等到时间到了才过期，无法主动过期
     * 所以，通常使用 redis 来处理 token 的过期时间，redis不仅可以设置过期时间，也能手动触发过期
     * 需手动触发过期的场景如：登出 修改密码 封号等
     */
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  /**
   * 获取用户信息
   */
  async getUserinfo(userId: number): Promise<{ dept: SysDeptEntity; roles: Array<SysRoleEntity>; posts: Array<SysPostEntity> } & UserEntity> {
    const entity = this.userRepo.createQueryBuilder('user');
    entity.where({
      userId: userId,
      delFlag: DelFlagEnum.NORMAL,
    });
    //联查部门详情
    entity.leftJoinAndMapOne('user.dept', SysDeptEntity, 'dept', 'dept.deptId = user.deptId');
    const roleIds = await this.getRoleIds([userId]);

    const roles = await this.sysRoleEntityRep.find({
      where: {
        delFlag: '0',
        roleId: In(roleIds),
      },
    });

    const postIds = (
      await this.sysUserWithPostEntityRep.find({
        where: {
          userId: userId,
        },
        select: ['postId'],
      })
    ).map((item) => item.postId);

    const posts = await this.sysPostEntityRep.find({
      where: {
        delFlag: '0',
        postId: In(postIds),
      },
    });

    const data = await entity.getOne();

    const result = {
      ...data,
      roles,
      posts,
      dept: (data as any).dept,
    };

    return result as { dept: SysDeptEntity; roles: Array<SysRoleEntity>; posts: Array<SysPostEntity> } & UserEntity;
  }

   /**
   * 获取角色Id列表
   * @param userId
   * @returns
   */
   async getRoleIds(userIds: Array<number>) {
    const roleList = await this.sysUserWithRoleEntityRep.find({
      where: {
        userId: In(userIds),
      },
      select: ['roleId'],
    });
    const roleIds = roleList.map((item) => item.roleId);
    return Uniq(roleIds);
  }

}
