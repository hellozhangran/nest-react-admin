import { Controller, Get, Post, Body, Put, Param, Query, Delete, HttpCode } from '@nestjs/common';
import { DeptService } from './dept.service';
import { CreateDeptDto, UpdateDeptDto, ListDeptDto } from './dto/index';


@Controller('system/dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  /**
   * 创建部门
   * @param createDeptDto 
   * @returns 
   */
  @Post('create')
  @HttpCode(200)
  create(@Body() createDeptDto: CreateDeptDto) {
    return this.deptService.create(createDeptDto);
  }

  /**
   * 获取部门列表
   * @param query 
   * @returns 
   */
  @Get('list')
  findAll(@Query() query: ListDeptDto) {
    return this.deptService.findAll(query);
  }

  /**
   * 获取部门详情
   * @param id 
   * @returns 
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deptService.findOne(+id);
  }

  /**
   * 更新部门
   * @param updateDeptDto 
   * @returns 
   */
  @Post('update')
  update(@Body() updateDeptDto: UpdateDeptDto) {
    return this.deptService.update(updateDeptDto);
  }

  /**
   * 删除部门
   * @param id 
   * @returns 
   */
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.deptService.remove(+id);
  }
}
