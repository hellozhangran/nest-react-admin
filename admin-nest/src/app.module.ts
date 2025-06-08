import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './blog/post/post.module';
import { CategoryModule } from './blog/category/category.module';
import { TagModule } from './blog/tag/tag.module';
import redisConfig from './config/redis.config';
import databaseConfig from './config/mysql.config';
import { CommonModule } from './modules/common/common.module';
import configuration from './config/env/index';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env',
      load: [configuration, databaseConfig, redisConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => 
        configService.get('mysql')!,
    }),
    CommonModule,
    UserModule,
    AuthModule,
    PostModule,
    CategoryModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
