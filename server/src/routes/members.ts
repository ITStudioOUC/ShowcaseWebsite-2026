import { Router, Request, Response } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/members?year=&dept=
router.get('/', (req: Request, res: Response) => {
  const { year, dept } = req.query;
  let sql = 'SELECT * FROM members WHERE 1=1';
  const params: any[] = [];

  if (year && year !== '全部') {
    sql += ' AND year = ?';
    params.push(year);
  }
  if (dept && dept !== '全部') {
    sql += ' AND dept = ?';
    params.push(dept);
  }

  sql += ' ORDER BY sort_order, id DESC';
  const members = db.prepare(sql).all(...params);
  res.json(members);
});

// GET /api/members/years
router.get('/years', (_req: Request, res: Response) => {
  const years = db.prepare('SELECT DISTINCT year FROM members ORDER BY year DESC').all() as any[];
  res.json(years.map((y: any) => y.year));
});

// GET /api/members/depts
router.get('/depts', (_req: Request, res: Response) => {
  const depts = db.prepare('SELECT DISTINCT dept FROM members ORDER BY dept').all() as any[];
  res.json(depts.map((d: any) => d.dept));
});

// POST /api/members
router.post('/', authMiddleware, (req: Request, res: Response) => {
  const { year, dept, title, name, avatar, dest, badge, tech, sort_order } = req.body;
  if (!year || !dept || !name) {
    res.status(400).json({ error: 'year, dept, name 为必填字段' });
    return;
  }

  const stmt = db.prepare(
    'INSERT INTO members (year, dept, title, name, avatar, dest, badge, tech, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(year, dept, title || '', name, avatar || '', dest || '', badge || '', tech || '', sort_order || 0);
  res.status(201).json({ id: result.lastInsertRowid });
});

// PUT /api/members/:id
router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { year, dept, title, name, avatar, dest, badge, tech, sort_order } = req.body;

  const existing = db.prepare('SELECT * FROM members WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: '成员不存在' });
    return;
  }

  const stmt = db.prepare(
    'UPDATE members SET year=?, dept=?, title=?, name=?, avatar=?, dest=?, badge=?, tech=?, sort_order=? WHERE id=?'
  );
  stmt.run(
    year ?? (existing as any).year,
    dept ?? (existing as any).dept,
    title ?? (existing as any).title,
    name ?? (existing as any).name,
    avatar ?? (existing as any).avatar,
    dest ?? (existing as any).dest,
    badge ?? (existing as any).badge,
    tech ?? (existing as any).tech,
    sort_order ?? (existing as any).sort_order,
    id
  );
  res.json({ success: true });
});

// DELETE /api/members/:id
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  db.prepare('DELETE FROM members WHERE id = ?').run(id);
  res.json({ success: true });
});

export default router;
