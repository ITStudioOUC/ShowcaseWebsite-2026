import { Router, Request, Response } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json(db.prepare('SELECT * FROM footer_contacts ORDER BY sort_order, id').all());
});

router.post('/', authMiddleware, (req: Request, res: Response) => {
  const { text, sort_order } = req.body;
  if (!text) { res.status(400).json({ error: 'text 为必填' }); return; }
  const count = (db.prepare('SELECT COUNT(*) as c FROM footer_contacts').get() as any).c;
  if (count >= 4) { res.status(400).json({ error: '最多4行' }); return; }
  const r = db.prepare('INSERT INTO footer_contacts (text, sort_order) VALUES (?, ?)').run(text, sort_order || 0);
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const e = db.prepare('SELECT * FROM footer_contacts WHERE id = ?').get(req.params.id) as any;
  if (!e) { res.status(404).json({ error: '不存在' }); return; }
  const { text, sort_order } = req.body;
  db.prepare('UPDATE footer_contacts SET text=?, sort_order=? WHERE id=?').run(
    text ?? e.text, sort_order ?? e.sort_order, req.params.id
  );
  res.json({ success: true });
});

router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  db.prepare('DELETE FROM footer_contacts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
