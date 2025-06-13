import { IsString, IsEnum, Length, IsOptional, IsNumber } from 'class-validator';
import { PagingDto } from 'src/common/dto/index';

export enum StatusEnum {
  STATIC = '0',
  DYNAMIC = '1',
}

export class CreatePostDto {
  @IsString()
  @Length(0, 50)
  postName: string;

  @IsString()
  @Length(0, 64)
  postCode: string;

  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  remark?: string;

  @IsOptional()
  @IsNumber()
  postSort?: number;
}

export class UpdatePostDto extends CreatePostDto {
  @IsNumber()
  postId: number;
}

export class ListPostDto extends PagingDto {
  @IsOptional()
  @IsString()
  @Length(0, 50)
  postName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 64)
  postCode?: string;

  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;
}
