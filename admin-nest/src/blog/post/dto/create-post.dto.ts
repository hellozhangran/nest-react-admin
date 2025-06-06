export class CreatePostDto {
  // 标题是必需的
  title: string;

  // 内容是必需的
  content: string;
  
  // 摘要是可选的
  summary?: string;

  // 封面图片是可选的
  coverImage?: string;

  // 是否推荐是可选的，默认为0
  isRecommend?: number;

  // 状态是可选的，默认为draft
  status?: 'draft' | 'published' | 'deleted';

  // 分类ID是必需的
  categoryId: number;

  // 标签ID数组是可选的
  tagIds?: number[];
}
