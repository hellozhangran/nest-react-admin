import { Controller, Get, Post, Body, Put, Param, Query, Delete, Res } from '@nestjs/common';
import { RoleService } from './role.service';
import { Response } from 'express';
import { CreateRoleDto, UpdateRoleDto, ListRoleDto, ChangeStatusDto, AuthUserCancelDto, AuthUserCancelAllDto, AuthUserSelectAllDto } from './dto/index';
import { AllocatedListDto } from '../user/dto/index';

import { UserService } from '../user/user.service';
import { User, UserDto } from '../user/user.decorator';

@Controller('system/role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  /**
   * 创建角色
   * @param createRoleDto 
   * @returns 
   */
  @Post('create')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  /**
   * 获取角色列表
   * @param query 
   * @param user 
   * @returns 
   */
  @Get('list')
  findAll(@Query() query: ListRoleDto, @User() user: UserDto) {
    return this.roleService.findAll(query);
  }

  /**
   * 获取角色详情
   * @param id 
   * @returns 
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  /**
   * 更新角色
   * @param updateRoleDto 
   * @returns 
   */
  @Post('update')
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto);
  }

  @Post('delete/:id')
  remove(@Param('id') ids: string) {
    const menuIds = ids.split(',').map((id) => +id);
    return this.roleService.remove(menuIds);
  }
}
