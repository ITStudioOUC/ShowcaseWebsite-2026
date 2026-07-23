import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'itstudio-showcase-secret-key-2026';

export function generateToken(userId: number, username: string): string {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '24h' });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: '未提供认证令牌' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: '认证令牌无效或已过期' });
  }
}
