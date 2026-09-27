import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', code: 'USER_NOT_FOUND' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'FETCH_USER_FAILED' });
  }
};

export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }

    const { name, mobile, age, gender, city, state, language, medicalHistory, diabeticStatus, onboardingComplete } = req.body;

    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name }
      });
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: {
        mobile: mobile !== undefined ? mobile : undefined,
        age: age !== undefined ? parseInt(age.toString()) : undefined,
        gender: gender !== undefined ? gender : undefined,
        city: city !== undefined ? city : undefined,
        state: state !== undefined ? state : undefined,
        language: language !== undefined ? language : undefined,
        medicalHistory: medicalHistory !== undefined ? medicalHistory : undefined,
        diabeticStatus: diabeticStatus !== undefined ? diabeticStatus : undefined,
        onboardingComplete: onboardingComplete !== undefined ? Boolean(onboardingComplete) : undefined
      },
      create: {
        userId,
        mobile,
        age: age ? parseInt(age.toString()) : null,
        gender,
        city,
        state,
        language: language || 'en',
        medicalHistory,
        diabeticStatus,
        onboardingComplete: onboardingComplete !== undefined ? Boolean(onboardingComplete) : false
      }
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'UPDATE_USER_FAILED' });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both passwords required', code: 'VALIDATION_ERROR' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', code: 'USER_NOT_FOUND' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect', code: 'INVALID_PASSWORD' });
    }

    const newHashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: newHashed }
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'PASSWORD_UPDATE_FAILED' });
  }
};
