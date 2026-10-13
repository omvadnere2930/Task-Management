import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validator.js';

const router = Router();

// Public routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// Protected routes (Requires valid JWT Bearer token)
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutUser);

export default router;
