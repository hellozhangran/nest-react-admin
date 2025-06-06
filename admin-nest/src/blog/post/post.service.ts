import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../category/entities/category.entity';
import { TagEntity } from '../tag/entities/tag.entity';
import { ResponsePostDto } from './dto/response-post.dto';


@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    @InjectRepository(CategoryEntity) 
    private readonly categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async create(user: UserEntity, createPostDto: CreatePostDto) {
    const { title } = createPostDto;
    if (!title) {
      throw new BadRequestException('标题不能为空');
    }

    const doc = await this.postRepository.findOne({ where: { title } });
    if (doc) {
      throw new BadRequestException('标题已存在');
    }

    // 不需要先查询 category 和 tags
    const post = this.postRepository.create({
      ...createPostDto,
      author: user,
      category: { id: createPostDto.categoryId },  // 直接用对象字面量，只提供 id
      tags: createPostDto.tagIds?.map(id => ({ id })) || []  // 同上
    });

    const result = await this.postRepository.save(post);
    return {
      code: 200,
      message: '创建成功',
      data: result.id,
    };
  }

  async findOne(id: number) {
    // 查询单个文章
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['category', 'tags', 'author'],
    });
    if (!post) {
      throw new NotFoundException('文章不存在');
    }
    return post.toResponseObject();
  }
  
  async findAll(params: any) {
    // 查询所有文章
    const builder = this.postRepository.createQueryBuilder('post');
      builder.leftJoinAndSelect('post.category', 'category');
      builder.leftJoinAndSelect('post.tags', 'tags');
      builder.leftJoinAndSelect('post.author', 'author')
      .orderBy('post.create_time', 'DESC');
    builder.where('1=1');

    const total = await builder.getCount();

    const { pageNum, pageSize } = params;

    console.log(11111111, pageNum, pageSize, total);

    builder.limit(pageSize);
    builder.offset((pageNum - 1) * pageSize);

    let many = await builder.getMany();
    const list: ResponsePostDto[] = many.map(item => item.toResponseObject());
    return { list, total };
  }

  async findByCategory(id: number) {
    // 查询分类下的所有文章
    const builder = this.postRepository.createQueryBuilder('post');
      builder.leftJoinAndSelect('post.category', 'category');
      builder.leftJoinAndSelect('post.tags', 'tags');
      builder.leftJoinAndSelect('post.author', 'author')
      .orderBy('post.create_time', 'DESC');

    builder.where('category.id = :id', { id });
    const many = await builder.getMany();
    const list: ResponsePostDto[] = many.map(item => item.toResponseObject());
    return list;
  }

  async findByTag(id: number) {
    // 查询标签下的所有文章  
    const builder = this.postRepository.createQueryBuilder('post');
      builder.leftJoinAndSelect('post.category', 'category');
      builder.leftJoinAndSelect('post.tags', 'tags');
      builder.leftJoinAndSelect('post.author', 'author')
      .orderBy('post.create_time', 'DESC');

    builder.where('tags.id = :id', { id });
    const many = await builder.getMany();
    const list: ResponsePostDto[] = many.map(item => item.toResponseObject());
    return list;
  }

}
