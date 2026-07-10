import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  constructor(private readonly configService: ConfigService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // Handle non-HTTP contexts (e.g., WebSockets, Microservices) gracefully
    if (host.getType() !== 'http') {
      return;
    }

    const response = ctx.getResponse<Response>();
    
    let exceptionStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';

    if (exception instanceof HttpException) {
      exceptionStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = exceptionResponse;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log the error
    if (exceptionStatus >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception instanceof Error ? exception.stack : exception);
    }

    const data: any = {
      statusCode: exceptionStatus,
      message: message,
      // Only send stack trace in development mode
      stack: this.configService.get('NODE_ENV') === 'development' && exception instanceof Error ? exception.stack : null,
      timestamp: new Date().toISOString()
    };

    // Format specific HTTP errors
    switch (exceptionStatus) {
      case HttpStatus.BAD_REQUEST:
        if (typeof message === 'object' && 'message' in (message as any)) {
          const msgObj = message as any;
          const messages = Array.isArray(msgObj.message) ? msgObj.message : [msgObj.message];
          data.message = messages[0];
        }
        break;
      case HttpStatus.UNAUTHORIZED:
        data.message = 'Unauthorized';
        break;
      case HttpStatus.TOO_MANY_REQUESTS:
        data.message = 'Too Many Requests';
        break;
    }

    // Clean up stack trace if not in development or null
    if (!data.stack) {
      delete data.stack;
    }

    return response.status(exceptionStatus).json(data);
  }
}
