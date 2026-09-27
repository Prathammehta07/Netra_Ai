import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import retinalRoutes from './routes/retinalRoutes';
import reportRoutes from './routes/reportRoutes';
import chatRoutes from './routes/chatRoutes';
import infoRoutes from './routes/infoRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static file serving for uploads and reports
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
app.use('/reports', express.static(path.join(__dirname, '../reports')));
app.use('/reports', express.static(path.join(__dirname, '../../reports')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/retinal', retinalRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', infoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Netra AI Backend API',
    version: '1.0.0',
    mode: process.env.AI_MODE || 'demo'
  });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Netra AI Backend Server listening on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});
