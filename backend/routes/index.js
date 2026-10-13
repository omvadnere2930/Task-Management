import { Router } from 'express';
import authRoutes from './authRoutes.js';
import taskRoutes from './taskRoutes.js';
import { dbStatus } from '../config/db.js';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    service: 'Cognevance Task Management API',
    status: 'ONLINE',
    database: {
      connected: dbStatus.isConnected,
      mode: dbStatus.mode,
      error: dbStatus.error,
    },
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/tasks', taskRoutes);

export default apiRouter;
