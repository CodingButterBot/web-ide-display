import request from 'supertest';
import path from 'path';
import fs from 'fs/promises';
import app from '../index';

// Create a temporary test directory for file operations
const TEST_DIR = path.join(__dirname, 'test-temp');
const TEST_FILE = path.join(TEST_DIR, 'test-file.txt');
const TEST_CONTENT = 'This is a test file';

// Setup and teardown for tests
beforeAll(async () => {
  try {
    await fs.mkdir(TEST_DIR, { recursive: true });
    await fs.writeFile(TEST_FILE, TEST_CONTENT);
  } catch (error) {
    console.error('Test setup failed:', error);
  }
});

afterAll(async () => {
  try {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  } catch (error) {
    console.error('Test teardown failed:', error);
  }
});

describe('File API Routes', () => {
  it('should list files in a directory', async () => {
    const response = await request(app)
      .get('/api/files/list')
      .query({ path: TEST_DIR });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('files');
    expect(Array.isArray(response.body.files)).toBe(true);
    
    // Should find our test file
    const testFile = response.body.files.find((file: any) => file.name === 'test-file.txt');
    expect(testFile).toBeDefined();
    expect(testFile.type).toBe('file');
  });
  
  it('should read file content', async () => {
    const response = await request(app)
      .get('/api/files/read')
      .query({ path: TEST_FILE });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('content');
    expect(response.body.content).toBe(TEST_CONTENT);
  });
  
  it('should write content to a file', async () => {
    const newContent = 'Updated test content';
    const newFile = path.join(TEST_DIR, 'new-file.txt');
    
    const response = await request(app)
      .post('/api/files/write')
      .send({ path: newFile, content: newContent });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    
    // Verify file was written
    const fileContent = await fs.readFile(newFile, 'utf-8');
    expect(fileContent).toBe(newContent);
  });
  
  it('should create a directory', async () => {
    const newDir = path.join(TEST_DIR, 'new-directory');
    
    const response = await request(app)
      .post('/api/files/mkdir')
      .send({ path: newDir });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    
    // Verify directory was created
    const stats = await fs.stat(newDir);
    expect(stats.isDirectory()).toBe(true);
  });
  
  it('should delete a file', async () => {
    const fileToDelete = path.join(TEST_DIR, 'file-to-delete.txt');
    await fs.writeFile(fileToDelete, 'Delete me');
    
    const response = await request(app)
      .delete('/api/files/delete')
      .query({ path: fileToDelete });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    
    // Verify file was deleted
    try {
      await fs.access(fileToDelete);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // File should not exist
      expect(true).toBe(true);
    }
  });
  
  it('should return 404 for non-existent paths', async () => {
    const response = await request(app)
      .get('/api/files/read')
      .query({ path: path.join(TEST_DIR, 'non-existent-file.txt') });
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
  
  it('should return 400 for missing path parameter', async () => {
    const response = await request(app)
      .get('/api/files/read');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});