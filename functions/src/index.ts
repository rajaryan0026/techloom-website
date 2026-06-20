import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import app from 'techloom-api';

setGlobalOptions({
  region: 'asia-south1',
  maxInstances: 10,
});

export const api = onRequest(
  {
    timeoutSeconds: 120,
    memory: '512MiB',
    cors: false,
  },
  app
);