import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { ApiResponse } from '../interfaces/response.interface';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      
      let status: number;
      let message: string;
      
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        
        if (typeof exceptionResponse === 'string') {
          message = exceptionResponse;
        } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
          message = (exceptionResponse as any).message || exception.message;
        } else {
          message = exception.message;
        }
      } else if (exception instanceof Error) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = exception.message;
      }
      else {
        // 未知错误
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal server error';
      }
  
      const errorResponse: ApiResponse<null> = {
        code: status,
        message: message,
        data: null,
      };
  
      response.status(status).json(errorResponse);
    }
}