import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/sys-user.entity';
import { SysUserWithPostEntity } from './entities/user-with-post.entity';
import { SysUserWithRoleEntity } from './entities/user-with-role.entity';
import { SysDeptEntity } from '../dept/entities/dept.entity';
import { SysRoleEntity } from '../role/entities/role.entity';
import { SysPostEntity } from '../post/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, SysUserWithPostEntity, SysUserWithRoleEntity, SysDeptEntity, SysRoleEntity, SysPostEntity]),
    // TODO 考虑以后是否放到更通用的位置
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
