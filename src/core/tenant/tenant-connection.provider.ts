import { Provider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

export const tenantConnectionProvider: Provider = {
  provide: TENANT_CONNECTION,
  scope: Scope.REQUEST,
  inject: [REQUEST, getConnectionToken()],
  useFactory: (request: any, connection: Connection) => {
    let tenantId = request.user?.tenantId;
    
    // In NestJS, request-scoped providers evaluate BEFORE AuthGuard runs.
    // So request.user will be undefined. We manually decode the token here to extract tenantId.
    // The guard will run immediately after and verify the token signature for actual security.
    if (!tenantId && request.headers?.authorization) {
      const authHeader = request.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const payloadBase64 = token.split('.')[1];
          if (payloadBase64) {
            const payloadBuffer = Buffer.from(payloadBase64, 'base64');
            const payload = JSON.parse(payloadBuffer.toString('utf-8'));
            if (payload.tenantId) {
              tenantId = payload.tenantId;
            }
          }
        } catch (e) {
          // Ignore error, fallback connection will be used, and AuthGuard will throw 401
        }
      }
    }

    // If there is no tenantId (e.g., public route, or admin), fallback to main connection
    if (!tenantId) {
      return connection;
    }

    // useDb switches the database and uses connection caching so we don't leak connections
    return connection.useDb(tenantId, { useCache: true });
  },
};
