import { Connection } from 'mongoose';
import { TENANT_CONNECTION } from '@core';
import { TaskSchema } from './schema/task.schema';

export const TASK_MODEL = 'TASK_MODEL';

export const taskModelProvider = {
  provide: TASK_MODEL,
  inject: [TENANT_CONNECTION],
  useFactory: (connection: Connection) => {
    return connection.model('Task', TaskSchema);
  },
};
