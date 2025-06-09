import { Controller, Get, Post, Body, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, ListUserDto, ChangeStatusDto, UpdateProfileDto, UpdatePwdDto } from './dto/index';
import { User, UserDto, UserTool, UserToolType } from './user.decorator';

@Controller('system/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}
  
  // 个人中心-用户信息
  @Get('profile')
  profile(@User() user: UserDto) {
    return "个人中心-用户信息";
  }
  
  // 个人中心-修改用户信息
  @Put('profile')
  updateProfile(@User() user: UserDto, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateProfile(user, updateProfileDto);
  }
 
  // 个人中心-修改密码
  @Put('profile/updatePwd')
  updatePwd(@User() user: UserDto, @Body() updatePwdDto: UpdatePwdDto) {
    return this.userService.updatePwd(user, updatePwdDto);
  }

  // 用户-创建
  @Post('create')
  create(@Body() createUserDto: CreateUserDto, @UserTool() { injectCreate }: UserToolType) {
    return this.userService.create(injectCreate(createUserDto));
  }

  // 用户-列表
  @Get('list')
  findAll(@Query() query: ListUserDto, @User() user: UserDto) {
    return this.userService.findAll(query, user.user);
  }

  // 用户-停用角色
  @Put('changeStatus')
  changeStatus(@Body() changeStatusDto: ChangeStatusDto) {
    return this.userService.changeStatus(changeStatusDto);
  }

  // 用户-更新
  @Put('update')
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: UserDto) {
    const activeUserId = user.userId;
    // const uuid = user.token;
    const result = await this.userService.update(updateUserDto, activeUserId);
    // await this.userService.updateRedisUserRolesAndPermissions(uuid, updateUserDto.userId);
    return result;
  }
}
