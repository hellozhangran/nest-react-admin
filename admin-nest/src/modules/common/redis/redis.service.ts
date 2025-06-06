import { InjectRedis } from '@songkeys/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly client: Redis) {}

  getClient(): Redis {
    return this.client;
  }

//   redis基本信息
  async getInfo() {
    // 连接到 Redis 服务器
    const rawInfo = await this.client.info();
    // 按行分割字符串
    const lines = rawInfo.split('\r\n');
    const parsedInfo = {};
    // 遍历每一行并分割键值对
    lines.forEach((line) => {
      const [key, value] = line.split(':');
      parsedInfo[key?.trim()] = value?.trim();
    });
    return parsedInfo;
  }

  // 分页查询缓存数据
  async skipFind(data: { key: string; pageSize: number; pageNum: number }) {
    const rawInfo = await this.client.lrange(data.key, (data.pageNum - 1) * data.pageSize, data.pageNum * data.pageSize);
    return rawInfo;
  }

  // 缓存Key数量
  async getDbSize() {
    return await this.client.dbsize();
  }

  async set(key: string, val: any, ttl?: number): Promise<'OK' | null> {
    const data = JSON.stringify(val);
    if (!ttl) return await this.client.set(key, data);
    return await this.client.set(key, data, 'PX', ttl);
  }

  // 获取对应 value
  async get(key: string): Promise<any> {
    if (!key || key === '*') return null;
    const res = await this.client.get(key);
    if (!res) return null;
    try {
      return JSON.parse(res);
    } catch (error) {
      return res;
    }
  }

  async mget(keys: string[]): Promise<any[]> {
    if (!keys) return [];
    const list = await this.client.mget(keys);
    return list.map((item) => item ? JSON.parse(item) : null);
  }

  // 删除缓存
  async del(keys: string | string[]): Promise<number> {
    if (!keys || keys === '*') return 0;
    if (typeof keys === 'string') keys = [keys];
    return await this.client.del(...keys);
  }

  // 获取对象keys
  async keys(key?: string) {
    if (!key) return [];
    return await this.client.keys(key);
  }

  // hash 设置 key 下单个 field value
  async hset(key: string, field: string, value: string): Promise<string | number | null> {
    if (!key || !field) return null;
    return await this.client.hset(key, field, value);
  }

  // hash 获取单个 field 的 value
  async hget(key: string, field: string): Promise<number | string | null> {
    if (!key || !field) return 0;
    return await this.client.hget(key, field);
  }

  // hash 获取 key 下所有field 的 value
  async hvals(key: string): Promise<string[]> {
    if (!key) return [];
    return await this.client.hvals(key);
  }

  // hash 删除 key 下 一个或多个 fields value
  async hdel(key: string, fields: string | string[]): Promise<string[] | number> {
    if (!key || fields.length === 0) return 0;
    return await this.client.hdel(key, ...fields);
  }

  // hash 删除 key 下所有 fields value
  async hdelAll(key: string): Promise<string[] | number> {
    if (!key) return 0;
    const fields = await this.client.hkeys(key);
    if (fields.length === 0) return 0;
    return await this.hdel(key, fields);
  }

  
  // 在列表中添加一个或多个值
  async lpush(key: string, ...val: string[]): Promise<number> {
    if (!key) return 0;
    return await this.client.lpush(key, ...val);
  }

  // 获取列表数据
  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    if (!key) return [];
    return await this.client.lrange(key, start, stop);
  }

  /**
   * 删除全部缓存
   * @returns
   */
  async reset() {
    const keys = await this.client.keys('*');
    return this.client.del(keys);
  }
}
