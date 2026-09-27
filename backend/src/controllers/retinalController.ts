import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { AIService } from '../services/aiService';

const aiService = new AIService();

export const uploadRetinalImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded',
        code: 'FILE_MISSING'
      });
    }

    const eye = req.body.eye || 'Right Eye';
    const relativePath = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      file: {
        path: relativePath,
        filename: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        eye
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'UPLOAD_FAILED' });
  }
};

export const analyzeRetinalImage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }

    const { imagePath, originalFilename, fileSize, mimeType, eye } = req.body;

    if (!imagePath) {
      return res.status(400).json({ success: false, message: 'imagePath is required', code: 'VALIDATION_ERROR' });
    }

    // Resolve physical path
    const cleanRelative = imagePath.replace('/uploads/', '');
    const absolutePath = path.join(__dirname, '../../uploads', cleanRelative);

    // Run AI analysis
    const aiResult = await aiService.analyzeRetinalImage(absolutePath);

    // Save to Database via Prisma
    const scan = await prisma.retinalScan.create({
      data: {
        userId,
        imagePath: imagePath.startsWith('/') ? imagePath : `/${imagePath}`,
        originalFilename: originalFilename || 'retinal_scan.png',
        fileSize: fileSize || 1024 * 500,
        mimeType: mimeType || 'image/png',
        eye: eye || 'Right Eye',
        analysisResult: {
          create: {
            qualityScore: aiResult.imageQuality.score,
            qualityUsable: aiResult.imageQuality.usable,
            screeningCategory: aiResult.screeningResult.category,
            screeningConfidence: aiResult.screeningResult.confidence,
            severity: aiResult.severity,
            explanation: aiResult.explanation,
            clinicalNotes: aiResult.clinicalNotes,
            modelVersion: aiResult.modelVersion,
            isDemo: aiResult.isDemo
          }
        },
        findings: {
          create: aiResult.findings.map((f) => ({
            type: f.type,
            count: f.count,
            confidence: f.confidence,
            locationsJson: JSON.stringify(f.locations)
          }))
        },
        review: {
          create: {
            status: 'PENDING',
            comments: 'Awaiting clinical review'
          }
        },
        report: {
          create: {
            reportNumber: `REP-${Date.now().toString().slice(-8)}`
          }
        }
      },
      include: {
        analysisResult: true,
        findings: true,
        review: true,
        report: true,
        user: {
          select: {
            id: true,
            name: true,
            profile: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Retinal AI analysis complete',
      scan
    });
  } catch (err: any) {
    console.error('Retinal analysis error:', err);
    res.status(500).json({ success: false, message: err.message || 'Unable to analyze retinal image', code: 'ANALYSIS_FAILED' });
  }
};

export const getScans = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }

    const scans = await prisma.retinalScan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        analysisResult: true,
        findings: true,
        review: true,
        report: true,
        user: {
          select: { name: true, profile: true }
        }
      }
    });

    res.json({
      success: true,
      count: scans.length,
      scans
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'FETCH_SCANS_FAILED' });
  }
};

export const getScanById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const scan = await prisma.retinalScan.findUnique({
      where: { id },
      include: {
        analysisResult: true,
        findings: true,
        review: true,
        report: true,
        user: {
          select: { id: true, name: true, profile: true }
        }
      }
    });

    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan not found', code: 'SCAN_NOT_FOUND' });
    }

    res.json({
      success: true,
      scan
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'FETCH_SCAN_FAILED' });
  }
};

export const deleteScan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.retinalScan.delete({ where: { id } });
    res.json({ success: true, message: 'Scan deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'DELETE_SCAN_FAILED' });
  }
};

export const getScanFindings = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const findings = await prisma.retinalFinding.findMany({
      where: { scanId: id }
    });
    res.json({ success: true, findings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'FETCH_FINDINGS_FAILED' });
  }
};
