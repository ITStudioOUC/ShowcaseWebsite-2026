import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// POST /api/upload
router.post('/', authMiddleware, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: '未上传文件' });
    return;
  }
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

export default router;
