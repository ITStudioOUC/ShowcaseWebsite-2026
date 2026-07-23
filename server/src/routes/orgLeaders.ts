import { Router, Request, Response } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/org-leaders?dept=
router.get('/', (req: Request, res: Response) => {
  const { dept } = req.query;
  let sql = 'SELECT * FROM org_leaders';
  const params: any[] = [];
  if (dept) { sql += ' WHERE dept = ?'; params.push(dept); }
  sql += ' ORDER BY sort_order, id';
  const list = db.prepare(sql).all(...params);
  res.json(list);
});

// POST /api/org-leaders
router.post('/', authMiddleware, (req: Request, res: Response) => {
  const { dept, title, name, avatar, tag, sort_order } = req.body;
  if (!dept || !name) { res.status(400).json({ error: 'dept, name 为必填字段' }); return; }
  const stmt = db.prepare('INSERT INTO org_leaders (dept, title, name, avatar, tag, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
  const result = stmt.run(dept, title || '', name, avatar || '', tag || '', sort_order || 0);
  res.status(201).json({ id: result.lastInsertRowid });
});

// PUT /api/org-leaders/:id
router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { dept, title, name, avatar, tag, sort_order } = req.body;
  const existing = db.prepare('SELECT * FROM org_leaders WHERE id = ?').get(id);
  if (!existing) { res.status(404).json({ error: '不存在' }); return; }
  const stmt = db.prepare('UPDATE org_leaders SET dept=?, title=?, name=?, avatar=?, tag=?, sort_order=? WHERE id=?');
  stmt.run(
    dept ?? (existing as any).dept, title ?? (existing as any).title,
    name ?? (existing as any).name, avatar ?? (existing as any).avatar,
    tag ?? (existing as any).tag, sort_order ?? (existing as any).sort_order, id
  );
  res.json({ success: true });
});

// DELETE /api/org-leaders/:id
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  db.prepare('DELETE FROM org_leaders WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
