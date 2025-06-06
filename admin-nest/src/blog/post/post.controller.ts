import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { RoleGuard, Roles } from 'src/auth/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/entities/user.entity';
import { CacheInterceptor } from 'src/common/interceptors/cache.interceptor';


@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @Roles('root', 'author')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  create(@Body() createPostDto: CreatePostDto, @Req() req: { user: UserEntity }) {
    return this.postService.create(req.user, createPostDto);
  }

  @Get('find/:id')
  @Roles('root', 'author', 'visitor')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  find(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Get('findAll')
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() params: any) {
    return this.postService.findAll(params);
  }

  @Get('findByCategory/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(CacheInterceptor)
  findByCategory(@Param('id') id: string) {
    return this.postService.findByCategory(+id);
  }

  @Get('findByTag/:id')
  @UseGuards(AuthGuard('jwt'))
  findByTag(@Param('id') id: string) {
    return this.postService.findByTag(+id);
  }
  
}
