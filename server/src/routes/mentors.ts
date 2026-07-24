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
  const { title, name, avatar, research, college, email, office, academic_title, link, sort_order } = req.body;
  if (!name) { res.status(400).json({ error: 'name 为必填字段' }); return; }
  const stmt = db.prepare('INSERT INTO mentors (title, name, avatar, research, college, email, office, academic_title, link, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const result = stmt.run(title || '', name, avatar || '', research || '', college || '', email || '', office || '', academic_title || '', link || '', sort_order || 0);
  res.status(201).json({ id: result.lastInsertRowid });
});

// PUT /api/mentors/:id
router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, name, avatar, research, college, email, office, academic_title, link, sort_order } = req.body;
  const existing = db.prepare('SELECT * FROM mentors WHERE id = ?').get(id) as any;
  if (!existing) { res.status(404).json({ error: '不存在' }); return; }
  const stmt = db.prepare('UPDATE mentors SET title=?, name=?, avatar=?, research=?, college=?, email=?, office=?, academic_title=?, link=?, sort_order=? WHERE id=?');
  stmt.run(
    title ?? existing.title, name ?? existing.name,
    avatar ?? existing.avatar, research ?? existing.research,
    college ?? existing.college, email ?? existing.email,
    office ?? existing.office, academic_title ?? existing.academic_title,
    link ?? existing.link,
    sort_order ?? existing.sort_order, id
  );
  res.json({ success: true });
});

// DELETE /api/mentors/:id
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  db.prepare('DELETE FROM mentors WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
