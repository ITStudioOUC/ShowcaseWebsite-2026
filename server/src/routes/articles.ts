import { Router, Request, Response } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { marked } from 'marked';

const router = Router();

// GET /api/articles - 文章列表（公开）
router.get('/', (_req: Request, res: Response) => {
  const list = db.prepare(
    'SELECT id, slug, title, published, created_at, updated_at FROM articles ORDER BY created_at DESC'
  ).all();
  res.json(list);
});

// GET /api/articles/:slug - 单篇文章（公开，返回 HTML）
router.get('/:slug', (req: Request, res: Response) => {
  const article = db.prepare('SELECT * FROM articles WHERE slug = ? AND published = 1').get(req.params.slug) as any;
  if (!article) {
    res.status(404).json({ error: '文章不存在' });
    return;
  }
  res.json({
    ...article,
    html: marked(article.content || '')
  });
});

// POST /api/articles
router.post('/', authMiddleware, (req: Request, res: Response) => {
  const { slug, title, content, published } = req.body;
  if (!slug || !title) { res.status(400).json({ error: 'slug, title 为必填字段' }); return; }
  const stmt = db.prepare(
    'INSERT INTO articles (slug, title, content, published) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(slug, title, content || '', published ?? 1);
  res.status(201).json({ id: result.lastInsertRowid });
});

// PUT /api/articles/:id
router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { slug, title, content, published } = req.body;
  const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  if (!existing) { res.status(404).json({ error: '文章不存在' }); return; }
  const stmt = db.prepare(
    'UPDATE articles SET slug=?, title=?, content=?, published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  );
  stmt.run(
    slug ?? (existing as any).slug,
    title ?? (existing as any).title,
    content ?? (existing as any).content,
    published ?? (existing as any).published,
    id
  );
  res.json({ success: true });
});

// DELETE /api/articles/:id
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
