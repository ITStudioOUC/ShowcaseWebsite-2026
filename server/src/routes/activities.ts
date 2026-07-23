import { Router, Request, Response } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/activities
router.get('/', (_req: Request, res: Response) => {
  const list = db.prepare('SELECT * FROM activities ORDER BY sort_order, id').all();
  res.json(list);
});

// POST /api/activities
router.post('/', authMiddleware, (req: Request, res: Response) => {
  const { title, desc, link, svg_d, sort_order } = req.body;
  if (!title) { res.status(400).json({ error: 'title 为必填字段' }); return; }
  const stmt = db.prepare('INSERT INTO activities (title, "desc", link, svg_d, sort_order) VALUES (?, ?, ?, ?, ?)');
  const result = stmt.run(title, desc || '', link || '', svg_d || '', sort_order || 0);
  res.status(201).json({ id: result.lastInsertRowid });
});

// PUT /api/activities/:id
router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, desc, link, svg_d, sort_order } = req.body;
  const existing = db.prepare('SELECT * FROM activities WHERE id = ?').get(id);
  if (!existing) { res.status(404).json({ error: '活动不存在' }); return; }
  const stmt = db.prepare('UPDATE activities SET title=?, "desc"=?, link=?, svg_d=?, sort_order=? WHERE id=?');
  stmt.run(
    title ?? (existing as any).title,
    desc ?? (existing as any).desc,
    link ?? (existing as any).link,
    svg_d ?? (existing as any).svg_d,
    sort_order ?? (existing as any).sort_order,
    id
  );
  res.json({ success: true });
});

// DELETE /api/activities/:id
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  db.prepare('DELETE FROM activities WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
