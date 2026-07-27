import { Router, Request, Response } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/depts — 返回有成员的所有部门
router.get('/', (_req: Request, res: Response) => {
  const list = db.prepare('SELECT DISTINCT dept FROM members ORDER BY dept').all() as { dept: string }[];
  res.json(list.map((r: { dept: string }) => r.dept));
});

export default router;
