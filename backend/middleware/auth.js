import jwt from 'jsonwebtoken';
import { StorageService } from '../services/storageService.js';

export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided. Please log in.',
    });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_token_key_cognevance_task_manager_2026_xyz987';
    const decoded = jwt.verify(token, secret);

    const user = await StorageService.findUserById(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
      return;
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.',
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Invalid or malformed authentication token.',
    });
  }
};
