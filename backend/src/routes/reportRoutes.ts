import { Router } from 'express';
import { getReports, getReportById, downloadReportPDF } from '../controllers/reportController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getReports);
router.get('/:id', getReportById);
router.get('/:id/pdf', downloadReportPDF);

export default router;
