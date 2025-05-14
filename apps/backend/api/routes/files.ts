import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { validatePath } from '../middleware/validation';

const router = express.Router();

// List files in a directory
router.get('/list', validatePath, async (req, res, next) => {
  try {
    const dirPath = req.query.path as string;
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    
    const fileList = await Promise.all(
      files.map(async (file) => {
        const isDirectory = file.isDirectory();
        const filePath = path.join(dirPath, file.name);
        const stats = await fs.stat(filePath);
        
        return {
          name: file.name,
          path: filePath,
          type: isDirectory ? 'directory' : 'file',
          size: stats.size,
          lastModified: stats.mtime
        };
      })
    );
    
    res.json({ files: fileList });
  } catch (error) {
    next(error);
  }
});

// Read file content
router.get('/read', validatePath, async (req, res, next) => {
  try {
    const filePath = req.query.path as string;
    const stats = await fs.stat(filePath);
    
    if (stats.isDirectory()) {
      return res.status(400).json({ error: 'Path is a directory, not a file' });
    }
    
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ 
      content,
      path: filePath,
      size: stats.size,
      lastModified: stats.mtime
    });
  } catch (error) {
    next(error);
  }
});

// Write to file
router.post('/write', validatePath, async (req, res, next) => {
  try {
    const { path: filePath, content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    await fs.writeFile(filePath, content, 'utf-8');
    const stats = await fs.stat(filePath);
    
    res.json({ 
      success: true,
      path: filePath,
      size: stats.size,
      lastModified: stats.mtime
    });
  } catch (error) {
    next(error);
  }
});

// Create a directory
router.post('/mkdir', validatePath, async (req, res, next) => {
  try {
    const { path: dirPath } = req.body;
    
    await fs.mkdir(dirPath, { recursive: true });
    
    res.json({ 
      success: true,
      path: dirPath
    });
  } catch (error) {
    next(error);
  }
});

// Delete a file or directory
router.delete('/delete', validatePath, async (req, res, next) => {
  try {
    const filePath = req.query.path as string;
    const stats = await fs.stat(filePath);
    
    if (stats.isDirectory()) {
      await fs.rm(filePath, { recursive: true });
    } else {
      await fs.unlink(filePath);
    }
    
    res.json({
      success: true,
      path: filePath
    });
  } catch (error) {
    next(error);
  }
});

export default router;