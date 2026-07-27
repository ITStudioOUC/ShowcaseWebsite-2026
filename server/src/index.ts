import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './db.js';

// 路由导入
import authRoutes from './routes/auth.js';
import memberRoutes from './routes/members.js';
import achievementRoutes from './routes/achievements.js';
import faqRoutes from './routes/faqs.js';
import statRoutes from './routes/stats.js';
import uploadRoutes from './routes/upload.js';
import orgLeaderRoutes from './routes/orgLeaders.js';
import mentorRoutes from './routes/mentors.js';
import gradeRoutes from './routes/grades.js';
import vibeImageRoutes from './routes/vibeImages.js';
import friendLinkRoutes from './routes/friendLinks.js';
import deptRoutes from './routes/depts.js';
import footerContactRoutes from './routes/footerContacts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// 初始化数据库
(async () => {
  await initDB();

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件 - 上传目录
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 生产环境托管前端构建产物
const publicDir = path.join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(publicDir));

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/org-leaders', orgLeaderRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/vibe-images', vibeImageRoutes);
app.use('/api/friend-links', friendLinkRoutes);
app.use('/api/depts', deptRoutes);
app.use('/api/footer-contacts', footerContactRoutes);

// SPA fallback: 所有非 API 请求返回 index.html
app.get(/^\/(?!api\/|uploads\/).*/, (_req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  res.sendFile(indexPath);
});

  app.listen(PORT, () => {
    console.log(`[Server] 爱特工作室展示网 API 已启动: http://localhost:${PORT}`);
  });
})();
