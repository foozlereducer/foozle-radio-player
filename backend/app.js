import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { radioRouter } from './routes/radio.js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

// Initialize Express app
const app = express();

// Middleware
app.use(helmet({
  // Audio is intentionally consumable by separately hosted, explicitly CORS-allowed frontends.
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
const configuredOrigins = process.env.FRONTEND_ORIGINS
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const allowedOrigins = new Set(configuredOrigins?.length ? configuredOrigins : [
  'http://localhost:5174',
  'https://localhost:5174',
  'http://127.0.0.1:5174',
  'https://127.0.0.1:5174',
]);

app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header include curl and same-origin server calls.
    callback(null, !origin || allowedOrigins.has(origin));
  },
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false, limit: '16kb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

app.use('/api', radioRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    error: err.status ? err.message : 'Internal Server Error',
  });
});
export default app;
