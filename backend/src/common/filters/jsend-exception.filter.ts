import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch()
export class JsendExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let statusCode = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const responseObj = exception.getResponse();

      message =
        typeof responseObj === 'string'
          ? responseObj
          : (responseObj as any).message || message;
    }

    response.status(statusCode).json({
      status: 'error',
      message: Array.isArray(message) ? message.join(', ') : message,
      statusCode,
      path: request.url,
    });
  }
}
