import { Module, Global } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClientOptions } from '@songkeys/nestjs-redis';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => config.get('redis')!,
      },
      true,
    ),
    AuthModule,
  ],
})
export class CommonModule {}


