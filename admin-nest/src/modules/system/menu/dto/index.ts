import { IsString, IsJSON, IsEnum, IsPhoneNumber, Min, Length, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export enum StatusEnum {
  STATIC = '0',
  DYNAMIC = '1',
}

//菜单类型
export enum MenuTypeEnum {
  M = 'M',
  C = 'C',
  F = 'F',
}

export class CreateMenuDto {
  @IsString()
  @Length(0, 50)
  menuName: string;

  @IsOptional()
  @IsNumber()
  orderNum: number;

  @IsOptional()
  @IsNumber()
  parentId: number;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  path?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  query: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  component?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  icon?: string;

  @IsOptional()
  @IsString()
  @IsEnum(MenuTypeEnum)
  menuType: string;

  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  isCache: string;

  @IsString()
  @IsEnum(StatusEnum)
  isFrame: string;

  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status: string;

  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  visible: string;

  @IsOptional()
  @IsString()
  perms: string;
}

export class UpdateMenuDto extends CreateMenuDto {
  @IsNumber()
  menuId: number;
}

export class ListDeptDto {
  @IsOptional()
  @IsString()
  menuName?: string;

  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;
}
