import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger('RequestInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    this.logger.log(`[REQ] ${method} ${url}`);

    return next
      .handle()
      .pipe(
        tap(() => {
          this.logger.log(`[RES] ${method} ${url} - ${Date.now() - now}ms`);
        }),
      );
  }
}
