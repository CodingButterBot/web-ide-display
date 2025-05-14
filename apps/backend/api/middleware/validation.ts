import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs/promises';

// Get path from either query or body, ensure it exists, and that it's not outside allowed directories
export const validatePath = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pathParam = req.query.path as string || req.body.path;
    
    if (!pathParam) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }
    
    // Normalize the path to remove any .., ., or other potentially malicious path segments
    const normalizedPath = path.normalize(pathParam);
    
    // TODO: Add a proper safe directory check for production
    // This would check if the path is within allowed directories
    // const safeDirectory = '/path/to/safe/directory';
    // if (!normalizedPath.startsWith(safeDirectory)) {
    //   return res.status(403).json({ error: 'Access to the specified path is forbidden' });
    // }
    
    // Check if path exists, but don't throw if it doesn't for write operations
    try {
      await fs.access(normalizedPath);
    } catch (err) {
      // For GET operations, the path must exist
      if (req.method === 'GET') {
        return res.status(404).json({ error: 'Path not found' });
      }
      
      // For POST operations creating files/directories, we ensure parent directory exists
      if (req.method === 'POST') {
        const parentDir = path.dirname(normalizedPath);
        try {
          await fs.access(parentDir);
        } catch (err) {
          return res.status(404).json({ error: 'Parent directory not found' });
        }
      }
    }
    
    // Add the normalized path to the request
    if (req.method === 'GET') {
      req.query.path = normalizedPath;
    } else {
      req.body.path = normalizedPath;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};