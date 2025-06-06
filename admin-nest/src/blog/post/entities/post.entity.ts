import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CategoryEntity } from "src/blog/category/entities/category.entity";
import { TagEntity } from "src/blog/tag/entities/tag.entity";
import { ResponsePostDto } from "../dto/response-post.dto";

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', nullable: false, length: 100})
  title: string;

  // markdown 内容
  @Column({type: 'text', nullable: false})
  content: string;

  // html 内容, 自动生成
  @Column({type: 'text', default: null, name: 'content_html'})
  contentHTML: string;

  // 摘要
  @Column({type: 'text', default: null})
  summary: string;

  // 封面图片
  @Column({type: 'varchar', default: null, name: 'cover_image'})
  coverImage: string;
  
  // 阅读量
  @Column({type: 'int', default: 0})
  count: number;

  // 点赞数
  @Column({type: 'int', default: 0, name: 'like_count'})
  likeCount: number;

  // 是否推荐
  @Column({type: 'tinyint', default: 0, name: 'is_recommend'})
  isRecommend: number;

  // 状态
  @Column({type: 'simple-enum', enum: ['draft', 'published', 'deleted'], default: 'draft'})
  status: string;
  // 作者
  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  // 分类
  @ManyToOne(() =>  CategoryEntity, (category) => category.posts)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  // 标签
  @ManyToMany(() => TagEntity, (tag) => tag.posts)
  @JoinTable({ 
    name: 'post_tag',
    joinColumn: { name: 'post_id' },
    inverseJoinColumn: { name: 'tag_id' }
  })
  tags: TagEntity[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  update_time: Date;


  @Column({type: 'datetime', default: null, name: 'publish_time'})
  publishTime: Date;

  // 转换为响应对象
  toResponseObject(): ResponsePostDto {
    let res: ResponsePostDto = {
      ...this,
      tags: this.tags?.map(tag => tag.name) || [],
      category: this.category?.name || '',
      author: this.author?.name || '',
    };
    return res;
  }
}
