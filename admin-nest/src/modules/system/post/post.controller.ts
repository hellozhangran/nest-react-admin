import { Controller, Get, Post, Body, Put, Param, Delete, Res, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto, ListPostDto } from './dto/index';
import { Response } from 'express';

@Controller('system/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

 
  /**
   * 创建岗位
   * @param createPostDto 
   * @returns 
   */
  @Post('create')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  /**
   * 获取岗位列表
   * @param query 
   * @returns 
   */
  @Get('/list')
  findAll(@Query() query: ListPostDto) {
    return this.postService.findAll(query);
  }


  /**
   * 获取岗位详情
   * @param id 
   * @returns 
   */
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  /**
   * 更新岗位
   * @param updatePostDto 
   * @returns 
   */
  @Post('update')
  update(@Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(updatePostDto);
  }

  /**
   * 删除岗位
   * @param ids 
   * @returns 
   */
  @Post('delete/:ids')
  remove(@Param('ids') ids: string) {
    const menuIds = ids.split(',').map((id) => id);
    return this.postService.remove(menuIds);
  }
}
