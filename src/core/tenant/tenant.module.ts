import { Global, Module } from '@nestjs/common';
import { tenantConnectionProvider, TENANT_CONNECTION } from './tenant-connection.provider';

@Global()
@Module({
  providers: [tenantConnectionProvider],
  exports: [TENANT_CONNECTION],
})
export class TenantModule {}
