import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { generatePDFReport } from '../services/pdfService';

export const getReports = async (req: AuthRequest, res: Response) => {
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
        review: true,
        report: true,
        user: { select: { id: true, name: true, profile: true } }
      }
    });

    const reports = scans.map((s) => ({
      id: s.id,
      reportNumber: s.report?.reportNumber || `REP-${s.id.slice(0, 8)}`,
      date: s.scanDate,
      patientName: s.user.name,
      patientId: s.user.id.slice(0, 8).toUpperCase(),
      eye: s.eye,
      screeningCategory: s.analysisResult?.screeningCategory || 'Pending',
      severity: s.analysisResult?.severity || 'Normal',
      status: s.review?.status || 'PENDING',
      imagePath: s.imagePath
    }));

    res.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'FETCH_REPORTS_FAILED' });
  }
};

export const getReportById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const scan = await prisma.retinalScan.findUnique({
      where: { id },
      include: {
        analysisResult: true,
        findings: true,
        review: true,
        report: true,
        user: { select: { id: true, name: true, profile: true } }
      }
    });

    if (!scan) {
      return res.status(404).json({ success: false, message: 'Report not found', code: 'REPORT_NOT_FOUND' });
    }

    res.json({
      success: true,
      report: scan
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'FETCH_REPORT_FAILED' });
  }
};

export const downloadReportPDF = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const scan = await prisma.retinalScan.findUnique({
      where: { id },
      include: {
        analysisResult: true,
        findings: true,
        review: true,
        report: true,
        user: { select: { id: true, name: true, profile: true } }
      }
    });

    if (!scan || !scan.analysisResult) {
      return res.status(404).json({ success: false, message: 'Report analysis data not found', code: 'REPORT_NOT_FOUND' });
    }

    const reportsDir = path.join(__dirname, '../../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const pdfFilename = `report-${scan.id}.pdf`;
    const pdfPath = path.join(reportsDir, pdfFilename);

    const reportData = {
      reportNumber: scan.report?.reportNumber || `REP-${scan.id.slice(0, 8)}`,
      patientName: scan.user.name,
      patientAge: scan.user.profile?.age || 'N/A',
      patientGender: scan.user.profile?.gender || 'N/A',
      patientId: scan.user.id.slice(0, 8).toUpperCase(),
      scanDate: new Date(scan.scanDate).toLocaleDateString(),
      eye: scan.eye,
      screeningCategory: scan.analysisResult.screeningCategory,
      screeningConfidence: scan.analysisResult.screeningConfidence,
      severity: scan.analysisResult.severity,
      explanation: scan.analysisResult.explanation,
      clinicalNotes: scan.analysisResult.clinicalNotes,
      findings: scan.findings.map((f) => ({ type: f.type, count: f.count })),
      reviewStatus: scan.review?.status || 'PENDING',
      reviewerComments: scan.review?.comments || undefined,
      modelVersion: scan.analysisResult.modelVersion,
      isDemo: scan.analysisResult.isDemo
    };

    await generatePDFReport(reportData, pdfPath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFilename}"`);

    const filestream = fs.createReadStream(pdfPath);
    filestream.pipe(res);
  } catch (err: any) {
    console.error('PDF Generation error:', err);
    res.status(500).json({ success: false, message: err.message || 'PDF Generation failed', code: 'PDF_GEN_FAILED' });
  }
};
