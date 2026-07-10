import { Scope } from '@nestjs/common';
import { Connection } from 'mongoose';
import { TENANT_CONNECTION } from '@core';
import { TaskSchema } from './schema/task.schema';

export const TASK_MODEL = 'TASK_MODEL';

export const taskModelProvider = {
  provide: TASK_MODEL,
  scope: Scope.REQUEST, // Explicitly marked as request-scoped
  inject: [TENANT_CONNECTION],
  useFactory: (connection: Connection) => {
    // Prevent OverwriteModelError since the connection instance is cached per tenant
    return connection.models['Task'] || connection.model('Task', TaskSchema);
  },
};
