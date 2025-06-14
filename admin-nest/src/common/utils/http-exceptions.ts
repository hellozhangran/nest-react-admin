import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  MethodNotAllowedException,
  NotAcceptableException,
  RequestTimeoutException,
  ConflictException,
  GoneException,
  PreconditionFailedException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  InternalServerErrorException,
  NotImplementedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
  HttpVersionNotSupportedException,
} from '@nestjs/common';

/**
 * HTTP 异常工具类
 * 提供语义化的异常抛出方法，让代码更易读易维护
 */
export class HttpExceptions {
  
  // ==================== 4xx 客户端错误 ====================
  
  /**
   * 400 - 请求参数错误
   */
  static badRequest(message = '请求参数错误') {
    throw new BadRequestException(message);
  }

  /**
   * 401 - 用户未认证（未登录）
   */
  static unauthorized(message = '用户未登录，请先登录') {
    throw new UnauthorizedException(message);
  }

  /**
   * 403 - 权限不足（已登录但无权限）
   */
  static forbidden(message = '权限不足，无法执行此操作') {
    throw new ForbiddenException(message);
  }

  /**
   * 404 - 资源不存在
   */
  static notFound(message = '请求的资源不存在') {
    throw new NotFoundException(message);
  }

  /**
   * 405 - 请求方法不允许
   */
  static methodNotAllowed(message = '请求方法不被允许') {
    throw new MethodNotAllowedException(message);
  }

  /**
   * 406 - 不可接受的请求
   */
  static notAcceptable(message = '请求不可接受') {
    throw new NotAcceptableException(message);
  }

  /**
   * 408 - 请求超时
   */
  static requestTimeout(message = '请求超时，请稍后重试') {
    throw new RequestTimeoutException(message);
  }

  /**
   * 409 - 资源冲突（如重复创建）
   */
  static conflict(message = '资源冲突，操作无法完成') {
    throw new ConflictException(message);
  }

  /**
   * 410 - 资源已不存在
   */
  static gone(message = '请求的资源已不存在') {
    throw new GoneException(message);
  }

  /**
   * 412 - 前置条件失败
   */
  static preconditionFailed(message = '请求的前置条件失败') {
    throw new PreconditionFailedException(message);
  }

  /**
   * 413 - 请求体过大
   */
  static payloadTooLarge(message = '请求体过大，请减少数据量') {
    throw new PayloadTooLargeException(message);
  }

  /**
   * 415 - 不支持的媒体类型
   */
  static unsupportedMediaType(message = '不支持的媒体类型') {
    throw new UnsupportedMediaTypeException(message);
  }

  /**
   * 422 - 数据格式错误（语法正确但语义错误）
   */
  static unprocessableEntity(message = '数据格式错误，无法处理') {
    throw new UnprocessableEntityException(message);
  }

  // ==================== 5xx 服务器错误 ====================

  /**
   * 500 - 服务器内部错误
   */
  static internalServerError(message = '服务器内部错误') {
    throw new InternalServerErrorException(message);
  }

  /**
   * 501 - 功能未实现
   */
  static notImplemented(message = '功能暂未实现') {
    throw new NotImplementedException(message);
  }

  /**
   * 502 - 网关错误
   */
  static badGateway(message = '网关错误') {
    throw new BadGatewayException(message);
  }

  /**
   * 503 - 服务不可用
   */
  static serviceUnavailable(message = '服务暂时不可用，请稍后重试') {
    throw new ServiceUnavailableException(message);
  }

  /**
   * 504 - 网关超时
   */
  static gatewayTimeout(message = '网关超时') {
    throw new GatewayTimeoutException(message);
  }

  /**
   * 505 - HTTP版本不支持
   */
  static httpVersionNotSupported(message = 'HTTP版本不被支持') {
    throw new HttpVersionNotSupportedException(message);
  }

  // ==================== 业务场景快捷方法 ====================

  /**
   * 用户相关异常
   */
  static user = {
    notFound: (message = '用户不存在') => HttpExceptions.notFound(message),
    unauthorized: (message = '用户名或密码错误') => HttpExceptions.unauthorized(message),
    forbidden: (message = '用户权限不足') => HttpExceptions.forbidden(message),
    exists: (message = '用户已存在') => HttpExceptions.conflict(message),
    disabled: (message = '用户已被禁用') => HttpExceptions.forbidden(message),
  };

  /**
   * 服务器相关异常
   */
  static server = {
    internalServerError: (message = '服务器内部错误') => HttpExceptions.internalServerError(message),
  };

  /**
   * 数据验证异常
   */
  static validation = {
    required: (field: string) => HttpExceptions.badRequest(`${field}不能为空`),
    invalid: (field: string) => HttpExceptions.badRequest(`${field}格式不正确`),
    tooLong: (field: string, max: number) => HttpExceptions.badRequest(`${field}长度不能超过${max}个字符`),
    tooShort: (field: string, min: number) => HttpExceptions.badRequest(`${field}长度不能少于${min}个字符`),
  };

  /**
   * 资源操作异常
   */
  static resource = {
    notFound: (resource: string) => HttpExceptions.notFound(`${resource}不存在`),
    exists: (resource: string) => HttpExceptions.conflict(`${resource}已存在`),
    inUse: (resource: string) => HttpExceptions.conflict(`${resource}正在使用中，无法删除`),
  };

  /**
   * 权限相关异常
   */
  static permission = {
    denied: (action: string) => HttpExceptions.forbidden(`无权限执行${action}操作`),
    expired: (message = '登录已过期，请重新登录') => HttpExceptions.unauthorized(message),
    invalid: (message = '无效的访问令牌') => HttpExceptions.unauthorized(message),
  };
} 