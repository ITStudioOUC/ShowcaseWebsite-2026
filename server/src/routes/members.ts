import { Router, Request, Response } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import XLSX from 'xlsx';

const router = Router();

// 导入导出字段映射
const FIELD_MAP: Record<string, string> = {
  '姓名': 'name',
  '部门': 'dept',
  '职务': 'title',
  '座右铭': 'dest',
  '头像': 'avatar',
};
const REVERSE_MAP: Record<string, string> = {
  name: '姓名', dept: '部门', title: '职务', dest: '座右铭', avatar: '头像',
};
const FIELDS = ['姓名', '部门', '职务', '座右铭', '头像'];

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

// GET /api/members/export?year=
router.get('/export', authMiddleware, (_req: Request, res: Response) => {
  const year = _req.query.year as string;
  let sql = 'SELECT name, dept, title, dest, avatar FROM members';
  const params: any[] = [];
  if (year && year !== '全部') { sql += ' WHERE year = ?'; params.push(year); }
  sql += ' ORDER BY sort_order, id';
  const rows = db.prepare(sql).all(...params) as any[];

  const data = rows.map((r: any) => ({
    '姓名': r.name, '部门': r.dept, '职务': r.title, '座右铭': r.dest, '头像': r.avatar,
  }));

  const ws = XLSX.utils.json_to_sheet(data, { header: FIELDS });
  ws['!cols'] = FIELDS.map(() => ({ wch: 25 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '成员');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=members_${year || 'all'}.xlsx`);
  res.send(Buffer.from(buf));
});

// POST /api/members/import
router.post('/import', authMiddleware, (req: Request, res: Response) => {
  const { year, data } = req.body;
  if (!year) { res.status(400).json({ error: 'year 为必填字段' }); return; }
  if (!data || !Array.isArray(data)) { res.status(400).json({ error: 'data 数组为必填' }); return; }

  let imported = 0;
  const stmt = db.prepare('INSERT INTO members (year, name, dept, title, dest, avatar) VALUES (?, ?, ?, ?, ?, ?)');

  for (const row of data) {
    const name = row['姓名'] || row['name'] || '';
    const dept = row['部门'] || row['dept'] || '';
    const title = row['职务'] || row['title'] || '';
    const dest = row['座右铭'] || row['dest'] || '';
    const avatar = row['头像'] || row['avatar'] || '';
    if (!name) continue;
    stmt.run(year, name, dept, title, dest, avatar);
    imported++;
  }

  res.json({ imported });
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
