import { OmitType } from '@nestjs/mapped-types';
import { UserEntity } from '../entities/user.entity';

// 从 UserEntity 中派生，排除自动生成的字段
export class CreateUserDto extends OmitType(UserEntity, [
  'id',
  'create_time',
  'update_time'
] as const) {}
