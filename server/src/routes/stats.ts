import { Router, Request, Response } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/stats
router.get('/', (_req: Request, res: Response) => {
  const rows = db.prepare('SELECT * FROM stats').all() as any[];
  const stats: Record<string, string> = {};
  rows.forEach((row: any) => { stats[row.key] = row.value; });
  res.json(stats);
});

// PUT /api/stats
router.put('/', authMiddleware, (req: Request, res: Response) => {
  const updates: Record<string, string> = req.body;
  for (const [key, value] of Object.entries(updates)) {
    const existing = db.prepare('SELECT id FROM stats WHERE key = ?').get(key);
    if (existing) {
      db.prepare('UPDATE stats SET value = ? WHERE key = ?').run(String(value), key);
    } else {
      db.prepare('INSERT INTO stats (key, value) VALUES (?, ?)').run(key, String(value));
    }
  }
  res.json({ success: true });
});

export default router;
