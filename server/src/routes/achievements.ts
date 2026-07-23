import { Router, Request, Response } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/achievements
router.get('/', (_req: Request, res: Response) => {
  const list = db.prepare('SELECT * FROM achievements ORDER BY sort_order, year DESC').all();
  // 将 tags 字符串解析为数组返回
  const result = (list as any[]).map((item: any) => ({
    ...item,
    tags: JSON.parse(item.tags || '[]')
  }));
  res.json(result);
});

// POST /api/achievements
router.post('/', authMiddleware, (req: Request, res: Response) => {
  const { year, depth, title, desc, tags, link, img, sort_order } = req.body;
  if (!year || !depth || !title) {
    res.status(400).json({ error: 'year, depth, title 为必填字段' });
    return;
  }
  const stmt = db.prepare(
    'INSERT INTO achievements (year, depth, title, "desc", tags, link, img, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(year, depth, title, desc || '', JSON.stringify(tags || []), link || '', img || '', sort_order || 0);
  res.status(201).json({ id: result.lastInsertRowid });
});

// PUT /api/achievements/:id
router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { year, depth, title, desc, tags, link, img, sort_order } = req.body;
  const existing = db.prepare('SELECT * FROM achievements WHERE id = ?').get(id);
  if (!existing) { res.status(404).json({ error: '成果不存在' }); return; }

  const stmt = db.prepare(
    'UPDATE achievements SET year=?, depth=?, title=?, "desc"=?, tags=?, link=?, img=?, sort_order=? WHERE id=?'
  );
  stmt.run(
    year ?? (existing as any).year,
    depth ?? (existing as any).depth,
    title ?? (existing as any).title,
    desc ?? (existing as any).desc,
    tags ? JSON.stringify(tags) : (existing as any).tags,
    link ?? (existing as any).link,
    img ?? (existing as any).img,
    sort_order ?? (existing as any).sort_order,
    id
  );
  res.json({ success: true });
});

// DELETE /api/achievements/:id
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  db.prepare('DELETE FROM achievements WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
