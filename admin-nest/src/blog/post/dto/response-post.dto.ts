import { OmitType } from '@nestjs/mapped-types';
import { PostEntity } from "../entities/post.entity";


export class ResponsePostDto extends OmitType(PostEntity, ['tags', 'category', 'author'] as const) {
  tags: string[];
  category: string;
  author: string;
}



// export class ResponsePostDto extends PostEntity {
//     declare tags: string[];
//     declare category: string;
//     declare author: string;
// }

// export class ResponsePostDto implements Omit<PostEntity, 'tags' | 'category' | 'author'> {
//     // 重新定义这三个属性的类型
//     tags: string[];
//     category: string;
//     author: string;
//   }