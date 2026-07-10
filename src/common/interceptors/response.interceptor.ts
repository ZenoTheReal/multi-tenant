import { Injectable, NestInterceptor, ExecutionContext, CallHandler, StreamableFile } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctxType = context.getType();
    
    if (ctxType !== 'http') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        // Handle cases where data is a Stream, Buffer, or StreamableFile (e.g. file downloads)
        // We shouldn't wrap these in JSON.
        if (
          data instanceof StreamableFile ||
          Buffer.isBuffer(data) ||
          (data && typeof data.pipe === 'function')
        ) {
          return data;
        }

        // If data is a plain object, we spread it as you requested
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
          return {
            statusCode,
            success: true,
            timestamp: new Date().toISOString(),
            ...data,
          };
        }

        // If data is a primitive (string, number, boolean) or an array, 
        // spreading it won't work correctly, so we nest it under a 'data' key.
        return {
          statusCode,
          success: true,
          data: data !== undefined ? data : null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}

