import { registerAs } from '@nestjs/config';
import { RedisClientOptions } from '@songkeys/nestjs-redis';

export default registerAs('redis', () => ({
  closeClient: true,
  readyLog: true,
  errorLog: true,
  config: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    //   password: process.env.REDIS_PWD || '******',
    db: parseInt(process.env.REDIS_DB || '0', 10),
  } as RedisClientOptions
}));