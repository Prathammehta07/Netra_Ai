import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  uploadRetinalImage,
  analyzeRetinalImage,
  getScans,
  getScanById,
  deleteScan,
  getScanFindings
} from '../controllers/retinalController';
import { saveScanReview } from '../controllers/reviewController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Configure storage
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `retina-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) && ['.jpg', '.jpeg', '.png'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG image files are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter
});

router.use(authenticateToken);

router.post('/upload', upload.single('image'), uploadRetinalImage);
router.post('/analyze', analyzeRetinalImage);
router.get('/scans', getScans);
router.get('/scans/:id', getScanById);
router.delete('/scans/:id', deleteScan);

// Findings & Review endpoints
router.get('/scans/:id/findings', getScanFindings);
router.post('/scans/:id/review', saveScanReview);
router.put('/scans/:id/review', saveScanReview);

export default router;
