import { IsString, IsEnum, IsArray, Length, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { PagingDto } from 'src/common/dto/index';

export enum StatusEnum {
  STATIC = '0',
  DYNAMIC = '1',
}

//菜单类型
export enum RoleTypeEnum {
  M = 'M',
  C = 'C',
  F = 'F',
}

export class CreateRoleDto {
  @IsString()
  @Length(0, 30)
  roleName: string;

  @IsString()
  @Length(0, 100)
  roleKey: string;

  @IsOptional()
  @IsArray()
  menuIds?: Array<number>;

  @IsOptional()
  @IsArray()
  deptIds?: Array<number>;

  @IsOptional()
  @IsNumber()
  roleSort?: number;

  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;

  @IsOptional()
  @IsString()
  dataScope: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  remark?: string;

  @IsOptional()
  @IsBoolean()
  menuCheckStrictly?: boolean;

  @IsOptional()
  @IsBoolean()
  deptCheckStrictly?: boolean;
}

export class UpdateRoleDto extends CreateRoleDto {
  @IsNumber()
  roleId: number;
}

export class ChangeStatusDto {
  @IsNumber()
  roleId: number;

  @IsString()
  @IsEnum(StatusEnum)
  status: string;
}

export class ListRoleDto extends PagingDto {
  @IsOptional()
  @IsString()
  @Length(0, 30)
  roleName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  roleKey?: string;

  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  roleId?: string;
}

export class AuthUserCancelDto {
  @IsNumber()
  roleId: number;

  @IsNumber()
  userId: number;
}

export class AuthUserCancelAllDto {
  @IsNumber()
  roleId: number;

  @IsString()
  userIds: string;
}

export class AuthUserSelectAllDto {
  @IsNumber()
  roleId: number;

  @IsString()
  userIds: string;
}
