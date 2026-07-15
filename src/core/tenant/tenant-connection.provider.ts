import { Provider, Scope, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { LRUCache } from 'lru-cache';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

// Create the LRU cache outside the request scope so it persists across requests
// This prevents memory bloat by only keeping the 1000 most recently used tenant DBs in memory
const tenantConnectionCache = new LRUCache<string, Connection>({
  max: 1000,
  // Optional: automatically remove tenant connections if they haven't been accessed in 1 hour
  ttl: 1000 * 60 * 60,
  dispose: (connection, key) => {
    Logger.debug(`Evicted tenant connection from cache: ${key}`, 'TenantConnectionProvider');
    // We don't need to close the connection because useDb shares the main socket,
    // but the garbage collector will now be free to clear out its cached schemas.
  },
});

export const tenantConnectionProvider: Provider = {
  provide: TENANT_CONNECTION,
  scope: Scope.REQUEST,
  inject: [REQUEST, getConnectionToken()],
  useFactory: (request: any, connection: Connection) => {
    let tenantId = request.user?.tenantId;
    const logger = new Logger('TenantConnectionProvider');
    
    // In NestJS, request-scoped providers evaluate BEFORE AuthGuard runs.
    // So request.user will be undefined. We manually decode the token here to extract tenantId.
    if (!tenantId && request.headers?.authorization) {
      const authHeader = request.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const payloadBase64 = token.split('.')[1];
          if (payloadBase64) {
            // Use base64url to properly handle JWT encoding
            const payloadBuffer = Buffer.from(payloadBase64, 'base64url');
            const payload = JSON.parse(payloadBuffer.toString('utf-8'));
            if (payload.tenantId) {
              tenantId = payload.tenantId;
            } else {
              logger.warn('Token provided but tenantId missing in payload! Please login again to get a new token.');
            }
          }
        } catch (e) {
          logger.error('Failed to parse JWT payload for tenantId extraction', e);
        }
      }
    }

    // If there is no tenantId (e.g., public route, or admin), fallback to main connection
    if (!tenantId) {
      return connection;
    }

    // Check if we already have this tenant's connection in our custom LRU cache
    let tenantDb = tenantConnectionCache.get(tenantId);
    
    if (!tenantDb) {
      // Create it with { useCache: false } so Mongoose doesn't cache it indefinitely internally
      tenantDb = connection.useDb(tenantId, { useCache: false });
      tenantConnectionCache.set(tenantId, tenantDb);
      logger.debug(`Created new tenant connection for: ${tenantId}`);
    }

    return tenantDb;
  },
};
