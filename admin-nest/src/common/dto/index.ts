import { IsDateString, IsNumber, IsNumberString, IsObject, IsOptional, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

enum SortRuleEnum {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

/**
 * 时间区间对象
 */
export class DateParamsDTO {
  @IsDateString()
  beginTime: string;

  @IsDateString()
  endTime: string;
}

/**
 * 分页DTO
 */
export class PagingDto {
  @IsOptional()
  @Transform(({ value }) => {
    return value?.toString?.() || '1';
  })
  @IsNumberString()
  pageNum?: number;

  @IsOptional()
  @Transform(({ value }) => {
    return value?.toString?.() || '10';
  })
  @IsNumberString()
  pageSize?: number;

  /**
   * 时间区间
   */
  @IsOptional()
  @IsObject()
  params?: DateParamsDTO;

  /**
   * 排序字段
   */
  @IsOptional()
  @IsString()
  orderByColumn?: string;

  /**
   * 排序规则
   */
  @IsOptional()
  @IsEnum(SortRuleEnum)
  isAsc?: string;
}
