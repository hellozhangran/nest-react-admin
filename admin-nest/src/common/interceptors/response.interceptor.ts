// cursor: disable

import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable, of, throwError } from 'rxjs';
  import { catchError, map, tap } from 'rxjs/operators';
  import { ApiResponse } from '../interfaces/response.interface';
  
  @Injectable()
  export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
      console.log('这里是before 拦截器');
      return next.handle().pipe(
        tap(data => {
          console.log('这里是after 拦截器');
        }),
        map(data => ({
          code: 200,
          message: 'success',
          data: data,
        })),
      );
    }
  }


  