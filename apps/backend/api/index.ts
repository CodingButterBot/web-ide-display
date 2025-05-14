import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fileRoutes from './routes/files';
import errorHandler from './middleware/errorHandler';
import rateLimiter from './middleware/rateLimiter';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimiter);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Web IDE Display API Server',
    version: '0.1.0',
    status: 'running'
  });
});

app.use('/api/files', fileRoutes);

// Error handler middleware (must be after routes)
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

export default app;