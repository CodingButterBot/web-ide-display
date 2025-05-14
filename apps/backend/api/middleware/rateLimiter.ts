import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter
const requestLog: Record<string, { count: number; lastReset: number }> = {};
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per minute

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || '';
  const now = Date.now();
  
  // Initialize or reset tracking for this IP
  if (!requestLog[ip] || now - requestLog[ip].lastReset > WINDOW_MS) {
    requestLog[ip] = {
      count: 0,
      lastReset: now
    };
  }
  
  // Increment the request count
  requestLog[ip].count++;
  
  // If too many requests, return 429
  if (requestLog[ip].count > MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many requests, please try again later',
      status: 429
    });
  }
  
  next();
};

export default rateLimiter;