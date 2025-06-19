import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { RedisService } from './modules/common/redis/redis.service';
import { ConfigService } from '@nestjs/config';
@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  @Get('hello')
  getHello(): string {
    const config = this.configService.get('yml.permission');
    console.log('eeee', config);
    return 'Hello World! ' + config.router.whitelist[0].path;
  }
  // set 一个redis key
  @Post('redis/set')
  async setRedis(@Body() body: any): Promise<any> {
    return await this.redisService.set(body.key, body.value);
  }

  // 获取redis key 的 value
  @Get('redis/get')
  async getRedis(@Query() query: any): Promise<any> {
    const { key } = query;
    if (!key) {
      return { error: 'key parameter is required' };
    }
    return await this.redisService.get(key);
  }

  // 获取redis基本信息
  @Get('redis/getInfo')
  async getRedisInfo(): Promise<any> {
    return await this.redisService.getInfo();
  }

  @Get('redis/keys')
  async getRedisKeys(): Promise<any> {
    return await this.redisService.keys();
  }
}

