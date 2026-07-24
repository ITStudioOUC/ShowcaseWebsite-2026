import { Router, Request, Response } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json(db.prepare('SELECT * FROM friend_links ORDER BY sort_order, id').all());
});

router.post('/', authMiddleware, (req: Request, res: Response) => {
  const { title, url, sort_order } = req.body;
  if (!title || !url) { res.status(400).json({ error: 'title, url 为必填' }); return; }
  const r = db.prepare('INSERT INTO friend_links (title, url, sort_order) VALUES (?, ?, ?)').run(title, url, sort_order || 0);
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const e = db.prepare('SELECT * FROM friend_links WHERE id = ?').get(req.params.id) as any;
  if (!e) { res.status(404).json({ error: '不存在' }); return; }
  const { title, url, sort_order } = req.body;
  db.prepare('UPDATE friend_links SET title=?, url=?, sort_order=? WHERE id=?').run(
    title ?? e.title, url ?? e.url, sort_order ?? e.sort_order, req.params.id
  );
  res.json({ success: true });
});

router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  db.prepare('DELETE FROM friend_links WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
