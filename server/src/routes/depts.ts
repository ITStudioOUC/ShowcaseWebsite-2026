import { Router, Request, Response } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/depts — 返回有成员的所有部门，可选 ?year= 按年份筛选
router.get('/', (req: Request, res: Response) => {
  const DEPT_ORDER: Record<string, number> = {
    '委员会': 1, '系统维护': 2, 'foss': 3, '宣传': 4,
    '程序': 5, 'web': 6, '游戏': 7, 'app': 8,
    'ios': 9, '鸿蒙': 10,
  };
  function normalize(name: string) {
    return name.toLowerCase().replace(/部$/, '');
  }
  const year = req.query.year as string | undefined;
  const sql = year
    ? 'SELECT DISTINCT dept FROM members WHERE year = ?'
    : 'SELECT DISTINCT dept FROM members';
  const raw = (db.prepare(sql).all(...(year ? [year] : [])) as { dept: string }[]).map(r => r.dept);
  const seen = new Map<string, string>();
  for (const name of raw) {
    const key = normalize(name);
    if (!seen.has(key)) seen.set(key, name);
  }
  const list = [...seen.values()]
    .sort((a, b) => (DEPT_ORDER[normalize(a)] || 99) - (DEPT_ORDER[normalize(b)] || 99));
  res.json(list);
});

export default router;
