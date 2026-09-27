import { Router } from 'express';
import { getMe, updateMe, updatePassword } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/me', getMe);
router.put('/me', updateMe);
router.put('/me/password', updatePassword);

export default router;
