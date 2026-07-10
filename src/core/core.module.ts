import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule, DbConnectionModule, AuthModule } from '@core';
import { TenantModule } from './tenant/tenant.module';

@Global()
@Module({
  imports: [
    ConfigModule, 
    DbConnectionModule, 
    AuthModule,
    TenantModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [ConfigModule, DbConnectionModule, AuthModule],
})
export class CoreModule {}

