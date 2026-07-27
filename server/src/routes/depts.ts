import { Router, Request, Response } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/depts — 返回有成员的所有部门
router.get('/', (_req: Request, res: Response) => {
  const DEPT_ORDER: Record<string, number> = {
    '委员会': 1, '系统维护部': 2, 'FOSS部': 3, '宣传部': 4,
    '程序部': 5, 'Web部': 6, '游戏部': 7, 'APP部': 8,
    'iOS部': 9, '鸿蒙部': 10,
  };
  const list = (db.prepare('SELECT DISTINCT dept FROM members').all() as { dept: string }[])
    .map(r => r.dept)
    .sort((a, b) => (DEPT_ORDER[a] || 99) - (DEPT_ORDER[b] || 99));
  res.json(list.map((r: { dept: string }) => r.dept));
});

export default router;
