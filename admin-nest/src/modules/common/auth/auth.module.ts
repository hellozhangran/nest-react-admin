import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthStrategy } from './auth.strategy';
import { UserEntity } from '@modules/system/user/entities/sys-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), TypeOrmModule.forFeature([UserEntity])],
  providers: [AuthStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
