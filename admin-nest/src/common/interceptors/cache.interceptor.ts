import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Observable, of, tap } from 'rxjs';
import { RedisService } from 'src/modules/common/redis/redis.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {

  @Inject(HttpAdapterHost)
  private httpAdapter: HttpAdapterHost;

  constructor(private readonly redisService: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = this.httpAdapter.httpAdapter.getRequestUrl(request);
    // 1. 先检查缓存
    const cachedValue = await this.redisService.get(key);
    if (cachedValue) {
      console.log('缓存命中', key, cachedValue);
      return of(cachedValue); // 缓存命中，直接返回
    }
    console.log('缓存未命中', key);
    return next.handle().pipe(
      tap((responseData) => {
        // 缓存响应数据，而不是undefined的value
        this.redisService.set(key, responseData, 5 * 60 * 1000); // 5分钟TTL
      }),
    );
  }
}
