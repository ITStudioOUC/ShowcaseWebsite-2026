import { Router, Request, Response } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/grades
router.get('/', (_req: Request, res: Response) => {
  const list = db.prepare('SELECT * FROM grades ORDER BY year DESC').all();
  res.json(list);
});

// POST /api/grades
router.post('/', authMiddleware, (req: Request, res: Response) => {
  const { year } = req.body;
  if (!year) { res.status(400).json({ error: 'year 为必填字段' }); return; }
  const existing = db.prepare('SELECT id FROM grades WHERE year = ?').get(year);
  if (existing) { res.status(409).json({ error: '该年级已存在' }); return; }
  const result = db.prepare('INSERT INTO grades (year) VALUES (?)').run(year);
  res.status(201).json({ id: result.lastInsertRowid, year });
});

// DELETE /api/grades/:id
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  const grade = db.prepare('SELECT * FROM grades WHERE id = ?').get(req.params.id) as any;
  if (!grade) { res.status(404).json({ error: '不存在' }); return; }
  // 同时删除该年级下的所有成员
  db.prepare('DELETE FROM members WHERE year = ?').run(grade.year);
  db.prepare('DELETE FROM grades WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
