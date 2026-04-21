import express from 'express';
import * as authController from '../controllers/authController';
import { loginLimiter, registerLimiter, refreshLimiter } from '../middleware/rateLimit';

const router = express.Router();

router.post('/register', registerLimiter, authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', refreshLimiter, authController.refreshToken);

export default router;