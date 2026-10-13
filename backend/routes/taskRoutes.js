import { Router } from 'express';
import {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  seedSampleTasks,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validateTask } from '../middleware/validator.js';

const router = Router();

// All task routes are protected by JWT authentication
router.use(protect);

router.get('/', getTasks);
router.post('/', validateTask, createTask);
router.get('/stats', getTaskStats);
router.post('/seed', seedSampleTasks);

router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
