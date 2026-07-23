import { Router, Request, Response } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/mentors
router.get('/', (_req: Request, res: Response) => {
  const list = db.prepare('SELECT * FROM mentors ORDER BY sort_order, id').all();
  res.json(list);
});

// POST /api/mentors
router.post('/', authMiddleware, (req: Request, res: Response) => {
  const { title, name, avatar, research, sort_order } = req.body;
  if (!name) { res.status(400).json({ error: 'name 为必填字段' }); return; }
  const stmt = db.prepare('INSERT INTO mentors (title, name, avatar, research, sort_order) VALUES (?, ?, ?, ?, ?)');
  const result = stmt.run(title || '', name, avatar || '', research || '', sort_order || 0);
  res.status(201).json({ id: result.lastInsertRowid });
});

// PUT /api/mentors/:id
router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, name, avatar, research, sort_order } = req.body;
  const existing = db.prepare('SELECT * FROM mentors WHERE id = ?').get(id);
  if (!existing) { res.status(404).json({ error: '不存在' }); return; }
  const stmt = db.prepare('UPDATE mentors SET title=?, name=?, avatar=?, research=?, sort_order=? WHERE id=?');
  stmt.run(
    title ?? (existing as any).title, name ?? (existing as any).name,
    avatar ?? (existing as any).avatar, research ?? (existing as any).research,
    sort_order ?? (existing as any).sort_order, id
  );
  res.json({ success: true });
});

// DELETE /api/mentors/:id
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  db.prepare('DELETE FROM mentors WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
