import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common'; 

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true, // 开启跨域访问
  });

  const config = app.get(ConfigService);
  const prefix = config.get('API_PREFIX') || 'api';
  app.setGlobalPrefix(prefix);

  // 全局验证管道：该配置可以让dto中使用class-validator配置的参数类型检查生效
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // 全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = config.get('PORT') || 3000;  
  await app.listen(port);

  console.log(`|-- admin-nest 服务启动成功!`);
  console.log(`|-- 地址前缀: `, `http://localhost:${port}/${prefix}/`);
  console.log(`|-- 测试API: `, `http://localhost:${port}/${prefix}/hello`);
}
bootstrap();

