import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes';

const app = express();

// ---------------------
// Global Middleware
// ---------------------
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ---------------------
// API Routes
// ---------------------
app.use('/api/v1', router);

// ---------------------
// Health Check
// ---------------------
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export { app };
