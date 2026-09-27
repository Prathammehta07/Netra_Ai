import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SERVER ERROR]', err);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error occurred';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  res.status(status).json({
    success: false,
    message,
    code
  });
};
