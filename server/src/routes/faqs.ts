import { Router, Request, Response } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/faqs
router.get('/', (_req: Request, res: Response) => {
  const list = db.prepare('SELECT * FROM faqs ORDER BY sort_order, id').all();
  res.json(list);
});

// POST /api/faqs
router.post('/', authMiddleware, (req: Request, res: Response) => {
  const { question, answer, sort_order } = req.body;
  if (!question || !answer) {
    res.status(400).json({ error: 'question, answer 为必填字段' });
    return;
  }
  const stmt = db.prepare('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)');
  const result = stmt.run(question, answer, sort_order || 0);
  res.status(201).json({ id: result.lastInsertRowid });
});

// PUT /api/faqs/:id
router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { question, answer, sort_order } = req.body;
  const existing = db.prepare('SELECT * FROM faqs WHERE id = ?').get(id);
  if (!existing) { res.status(404).json({ error: 'FAQ 不存在' }); return; }
  const stmt = db.prepare('UPDATE faqs SET question=?, answer=?, sort_order=? WHERE id=?');
  stmt.run(
    question ?? (existing as any).question,
    answer ?? (existing as any).answer,
    sort_order ?? (existing as any).sort_order,
    id
  );
  res.json({ success: true });
});

// DELETE /api/faqs/:id
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  db.prepare('DELETE FROM faqs WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
