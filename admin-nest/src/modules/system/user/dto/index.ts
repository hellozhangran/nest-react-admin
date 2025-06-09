import { IsString, IsEnum, IsArray, Length, IsOptional, IsNumber, IsNumberString, IsEmail } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { PagingDto } from 'src/common/dto/index';


export enum StatusEnum {
  STATIC = '0',
  DYNAMIC = '1',
}
  
  export class CreateUserDto {
    @IsOptional()
    @IsNumber()
    deptId?: number;
  
    @IsOptional()
    // @IsEmail()
    @Length(0, 50)
    email: string;
  
    @IsString()
    @Length(0, 30)
    nickName: string;
  
    @IsString()
    @Length(0, 30)
    userName: string;
  
    @IsString()
    @Length(0, 200)
    password: string;
  
    @IsOptional()
    @IsString()
    // @IsPhoneNumber('CN')
    phonenumber?: string;
  
    @IsOptional()
    @IsArray()
    postIds?: Array<number>;
  
    @IsOptional()
    @IsArray()
    roleIds?: Array<number>;
  
    @IsOptional()
    @IsString()
    @IsEnum(StatusEnum)
    status?: string;
  
    @IsOptional()
    @IsString()
    @IsEnum(StatusEnum)
    sex?: string;
  
    @IsOptional()
    @IsString()
    @Length(0, 500)
    remark?: string;
  
    @IsOptional()
    @IsNumber()
    postSort?: number;
  }
  
  export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNumber()
    userId: number;
  }
  
  export class ChangeStatusDto {
    @IsNumber()
    userId: number;
  
    @IsString()
    @IsEnum(StatusEnum)
    status: string;
  }
  
  export class ListUserDto extends PagingDto {
    @IsOptional()
    @IsNumberString()
    deptId?: string;
  
    @IsOptional()
    @IsString()
    @Length(0, 30)
    nickName?: string;
  
    @IsOptional()
    @IsString()
    @Length(0, 30)
    email?: string;
  
    @IsOptional()
    @IsString()
    @Length(0, 30)
    userName?: string;
  
    @IsOptional()
    @IsString()
    phonenumber?: string;
  
    @IsOptional()
    @IsString()
    @IsEnum(StatusEnum)
    status?: string;
  }
  
  export class ResetPwdDto {
    @IsNumber()
    userId: number;
  
    @IsString()
    @Length(5, 20)
    password: string;
  }
  
  export class AllocatedListDto extends PagingDto {
    @IsOptional()
    @IsString()
    @Length(0, 30)
    userName?: string;
  
    @IsOptional()
    @IsString()
    phonenumber?: string;
  
    @IsOptional()
    @IsNumberString()
    roleId?: string;
  }
  
  export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @Length(0, 30)
    nickName: string;
  
    @IsOptional()
    @IsEmail()
    @Length(0, 50)
    email: string;
  
    @IsOptional()
    @IsString()
    phonenumber: string;
  
    @IsOptional()
    @IsString()
    @IsEnum(StatusEnum)
    sex: string;
  
    @IsOptional()
    @IsString()
    avatar?: string;
  }
  
  export class UpdatePwdDto {
    @IsString()
    @Length(0, 200)
    oldPassword: string;
  
    @IsString()
    @Length(0, 200)
    newPassword: string;
  }
  