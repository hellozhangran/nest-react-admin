import { IsString, IsJSON, IsEnum, IsPhoneNumber, Min, Length, IsOptional, IsBoolean, IsNumber, IsEmail } from 'class-validator';

export enum StatusEnum {
  STATIC = '0',
  DYNAMIC = '1',
}
export class CreateDeptDto {
  @IsNumber()
  parentId: number;

  @IsString()
  @Length(0, 30)
  deptName: string;

  @IsNumber()
  @Min(0)
  orderNum: number;

  @IsOptional()
  @IsString()
  leader?: string;

  @IsOptional()
  @IsString()
  @Length(0, 11)
  phone?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;
}

export class UpdateDeptDto extends CreateDeptDto {
  @IsNumber()
  deptId: number;
}

export class ListDeptDto {
  @IsOptional()
  @IsString()
  deptName?: string;

  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;
}
