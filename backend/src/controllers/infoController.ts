import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getGovernmentSchemes = async (req: Request, res: Response) => {
  try {
    const schemes = await prisma.governmentScheme.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json({
      success: true,
      count: schemes.length,
      schemes
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'FETCH_SCHEMES_FAILED' });
  }
};

export const getEmergencyNumbers = async (req: Request, res: Response) => {
  try {
    const numbers = await prisma.emergencyNumber.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json({
      success: true,
      count: numbers.length,
      numbers
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'FETCH_EMERGENCY_FAILED' });
  }
};
