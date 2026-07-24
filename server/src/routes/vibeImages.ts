import { Router, Request, Response } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/vibe-images
router.get('/', (_req: Request, res: Response) => {
  const list = db.prepare('SELECT * FROM vibe_images ORDER BY sort_order, id').all();
  res.json(list);
});

// POST /api/vibe-images
router.post('/', authMiddleware, (req: Request, res: Response) => {
  const { url, title, width, height, sort_order } = req.body;
  if (!url) { res.status(400).json({ error: 'url 为必填字段' }); return; }
  const stmt = db.prepare('INSERT INTO vibe_images (url, title, width, height, sort_order) VALUES (?, ?, ?, ?, ?)');
  const result = stmt.run(url, title || '', width || 800, height || 600, sort_order || 0);
  res.status(201).json({ id: result.lastInsertRowid });
});

// PUT /api/vibe-images/:id
router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const existing = db.prepare('SELECT * FROM vibe_images WHERE id = ?').get(req.params.id) as any;
  if (!existing) { res.status(404).json({ error: '不存在' }); return; }
  const { url, title, width, height, sort_order } = req.body;
  db.prepare('UPDATE vibe_images SET url=?, title=?, width=?, height=?, sort_order=? WHERE id=?').run(
    url ?? existing.url, title ?? existing.title,
    width ?? existing.width, height ?? existing.height,
    sort_order ?? existing.sort_order, req.params.id
  );
  res.json({ success: true });
});

// DELETE /api/vibe-images/:id
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  db.prepare('DELETE FROM vibe_images WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
