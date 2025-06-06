import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './modules/common/redis/redis.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    private readonly redisService: RedisService
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
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
