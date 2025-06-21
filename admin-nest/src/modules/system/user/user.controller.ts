import { Controller, Get, Post, Body, Put, Query, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, ListUserDto, ChangeStatusDto, UpdateProfileDto, UpdatePwdDto, LoginDto } from './dto/index';
import { User, UserDto, UserTool, UserToolType } from './user.decorator';
import { ClientInfo, ClientInfoDto } from '@/common/decorators/client.decorator';

@Controller('system/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  // 用户-创建
  @Post('create')
  create(@Body() createUserDto: CreateUserDto, @UserTool() { injectCreate }: UserToolType) {
    return this.userService.create(injectCreate(createUserDto));
  }
  
  // 个人中心-用户信息
  @Get('profile')
  profile(@User() user: UserDto) {
    return user.user;
  }

  // 用户-用户信息，除了user.user，还包括角色，权限等信息
  @Get('info')
  info(@User() user: UserDto) {
    return user.user;
  }
  
  // 个人中心-修改用户信息
  @Put('profile')
  updateProfile(user: UserDto, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateProfile(user, updateProfileDto);
  }

  // 用户-列表
  @Get('list')
  findAll(@Query() query: ListUserDto) {
    return this.userService.findAll(query);
  }

  @Post('login')
  login(@Body() user: LoginDto, @ClientInfo() clientInfo: ClientInfoDto) {
    return this.userService.login(user, clientInfo);
  }
}
