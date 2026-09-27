import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const saveScanReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, comments, modifiedSeverity } = req.body;
    const reviewerId = req.user?.id;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Review status is required', code: 'VALIDATION_ERROR' });
    }

    const review = await prisma.professionalReview.upsert({
      where: { scanId: id },
      update: {
        status,
        comments,
        modifiedSeverity,
        reviewerId: reviewerId || null,
        reviewedAt: new Date()
      },
      create: {
        scanId: id,
        status,
        comments,
        modifiedSeverity,
        reviewerId: reviewerId || null,
        reviewedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Professional review saved successfully',
      review
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'SAVE_REVIEW_FAILED' });
  }
};
