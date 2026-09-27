import { Router } from 'express';
import {
  postChatMessage,
  getChatSessions,
  getChatSessionById,
  deleteChatSession
} from '../controllers/chatController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.post('/message', postChatMessage);
router.get('/sessions', getChatSessions);
router.get('/sessions/:id', getChatSessionById);
router.delete('/sessions/:id', deleteChatSession);

export default router;
