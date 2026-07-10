import { Provider, Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

export const tenantConnectionProvider: Provider = {
  provide: TENANT_CONNECTION,
  scope: Scope.REQUEST,
  inject: [REQUEST, getConnectionToken()],
  useFactory: (request: any, connection: Connection) => {
    const tenantId = request.user?.tenantId;
    
    // If there is no tenantId (e.g., public route, or admin), fallback to main connection
    // Or throw an error if you want strict isolation
    if (!tenantId) {
      return connection;
    }

    // useDb switches the database and uses connection caching so we don't leak connections
    return connection.useDb(tenantId, { useCache: true });
  },
};
