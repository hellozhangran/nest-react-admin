import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto, ListDeptDto } from './dto/index';

@Controller('system/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * 创建菜单
   * @param createMenuDto 
   * @returns 
   */
  @Post('create')
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  /**
   * 获取菜单列表
   * @param query 
   * @returns 
   */
  @Get('list')
  findAll(@Query() query: ListDeptDto) {
    return this.menuService.findAll(query);
  }

  /**
   * 获取菜单树
   * @returns 
   */
  @Get('treeselect')
  treeSelect() {
    return this.menuService.treeSelect();
  }

  /**
   * 获取菜单详情
   * @param menuId 
   * @returns 
   */
  @Get(':menuId')
  findOne(@Param('menuId') menuId: string) {
    return this.menuService.findOne(+menuId);
  }

  @Post('update')
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(updateMenuDto);
  }

  @Post('delete/:menuId')
  remove(@Param('menuId') menuId: string) {
    return this.menuService.remove(+menuId);
  }
}
