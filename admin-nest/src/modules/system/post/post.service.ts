import { In, Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { SysPostEntity } from "./entities/post.entity";
import { CreatePostDto, ListPostDto, UpdatePostDto } from "./dto";

export class PostService {
  constructor(
    @InjectRepository(SysPostEntity)
    private readonly sysPostEntityRep: Repository<SysPostEntity>,
  ) {}

  /**
   * 创建岗位
   * @param createPostDto 
   * @returns 
   */
  async create(createPostDto: CreatePostDto) {
    await this.sysPostEntityRep.save(createPostDto);
    return 'ok';
  }

  /**
   * 获取岗位列表
   * @param query 
   * @returns 
   */
  async findAll(query: ListPostDto) {
    const entity = this.sysPostEntityRep.createQueryBuilder('entity');
    entity.where('entity.delFlag = :delFlag', { delFlag: '0' });

    if (query.postName) {
      entity.andWhere(`entity.postName LIKE "%${query.postName}%"`);
    }

    if (query.postCode) {
      entity.andWhere(`entity.postCode LIKE "%${query.postCode}%"`);
    }

    if (query.status) {
      entity.andWhere('entity.status = :status', { status: query.status });
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
   * 获取岗位详情
   * @param postId 
   * @returns 
   */
  async findOne(postId: number) {
    const res = await this.sysPostEntityRep.findOne({
      where: {
        postId: postId,
        delFlag: '0',
      },
    });
    return res;
  }

  /**
   * 更新岗位
   * @param updatePostDto 
   * @returns 
   */
  async update(updatePostDto: UpdatePostDto) {
    await this.sysPostEntityRep.update({ postId: updatePostDto.postId }, updatePostDto);
    return 'ok';
  }

  /**
   * 删除岗位
   * @param postIds 
   * @returns 
   */
  async remove(postIds: string[]) {
    await this.sysPostEntityRep.update(
      { postId: In(postIds) },
      {
        delFlag: '1',
      },
    );
    return 'ok';
  }
}