import express from 'express';
import cors from 'cors';
import aiRouter from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'],
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/ai', aiRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n  🚀 LocalCV Backend running on http://localhost:${PORT}`);
  console.log(`  📡 AI endpoint: http://localhost:${PORT}/api/ai/status`);
  console.log(`  🔒 CORS enabled for local development\n`);
});
