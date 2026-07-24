# 爱特工作室展示网 · IT Studio Showcase

中国海洋大学爱特工作室（IT Studio）官方展示网站。全栈项目，包含展示首页与后台内容管理系统。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端框架 | Vue 3 + Composition API + Vite |
| 样式 | Tailwind CSS + SCSS |
| 动画 | GSAP + ScrollTrigger |
| 后端 | Express.js (TypeScript, tsx 运行) |
| 数据库 | SQLite (sql.js，纯 JS 实现，零原生依赖) |
| 认证 | JWT (jsonwebtoken + bcryptjs) |
| 文件上传 | Multer |
| 数据导入导出 | xlsx + jszip |

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 初始化数据库（创建 SQLite 并填充初始数据）
npm run seed

# 3. 开发模式（前后端热重载，需要两个终端）
npm run dev
# 或者分别启动:
npm run dev:server   # 后端 http://localhost:3001
npm run dev:client   # 前端 http://localhost:5173

# 4. 生产构建
npm run build        # 构建前端到 client/dist/
npm start            # Express 托管前端静态文件 + API
```

打开浏览器访问:
- **展示首页**: `http://localhost:5173`（开发）/ `http://localhost:3001`（生产）
- **后台管理**: `http://localhost:5173/admin/login`

**默认管理员**: `admin` / `admin123`

## 项目结构

```
ShowcaseWebsite-2026/
├── client/                          # Vue 3 前端
│   ├── src/
│   │   ├── components/
│   │   │   ├── showcase/            # 14 个展示页组件
│   │   │   ├── admin/               # 后台管理组件
│   │   │   └── shared/              # 共享组件
│   │   ├── composables/             # useApi / useGsap / useUpload
│   │   ├── stores/                  # Pinia (app + auth)
│   │   ├── router/                  # Vue Router
│   │   ├── assets/                  # 静态资源 + 样式
│   │   └── types/                   # TypeScript 类型
│   ├── vite.config.ts
│   └── package.json
│
├── server/                          # Express 后端
│   ├── src/
│   │   ├── routes/                  # API 路由
│   │   ├── middleware/              # JWT 认证 / 文件上传
│   │   ├── db.ts                    # SQLite 连接 + 表初始化
│   │   ├── seed.ts                  # 初始数据填充
│   │   └── index.ts                 # 服务入口
│   ├── data/                        # SQLite 数据库文件 (gitignore)
│   ├── uploads/                     # 上传文件目录 (gitignore)
│   └── package.json
│
└── package.json                     # Workspace 根
```

## 后台管理功能

访问 `/admin/login` 登录后可使用:

| 功能 | 路径 | 说明 |
|---|---|---|
| 仪表盘 | `/admin/dashboard` | 数据统计概览 |
| 成员管理 | `/admin/members` | 先建年级，再管理成员，支持 Excel 导入/导出(zip) |
| 导师管理 | `/admin/mentors` | 支持文件上传头像 |
| 成果管理 | `/admin/achievements` | 按年份分组，标签/链接/图片 |
| FAQ 管理 | `/admin/faqs` | Q&A 内容编辑 |
| 友情链接 | `/admin/friend-links` | 页脚链接管理 |
| 风情图片 | `/admin/vibe-images` | 画廊图片，上传自动识别尺寸 |
| 站点设置 | `/admin/settings` | 状态栏/备案号/页脚联系方式 |

## 页面结构

| Section | 编号 | 内容 |
|---|---|---|
| Hero | — | 开场动画：Logo + 艺术字滑出 |
| 关于爱特 | 01 | 介绍文字 + 统计数字 + 硬件设施 |
| 指导老师团队 | 02 | 3 列名片，hover 膨胀，点击跳转 |
| 历年成员 | 03 | 年级/部门筛选，4 列卡片展示 |
| 我们的成果 | 04 | 年份时间轴 + 2 列成果卡片 |
| 工作室风情 | 05 | 双行自动滚动图片廊，点击灯箱 |
| 常见问题 | 06 | Q/A 分行布局 |

## API 路由

所有 `/api/*` 路由（除 `/api/auth/login`）需要 JWT 认证时在 Header 中携带 `Authorization: Bearer <token>`。

| 资源 | 路由 | 方法 |
|---|---|---|
| 认证 | `/api/auth/login`, `/api/auth/me` | POST, GET |
| 成员 | `/api/members`, `/api/members/:id` | GET,POST,PUT,DELETE |
| 成员导入导出 | `/api/members/import`, `/api/members/export` | POST, GET |
| 年级 | `/api/grades`, `/api/grades/:id` | GET,POST,DELETE |
| 导师 | `/api/mentors`, `/api/mentors/:id` | GET,POST,PUT,DELETE |
| 成果 | `/api/achievements`, `/api/achievements/:id` | GET,POST,PUT,DELETE |
| FAQ | `/api/faqs`, `/api/faqs/:id` | GET,POST,PUT,DELETE |
| 友情链接 | `/api/friend-links`, `/api/friend-links/:id` | GET,POST,PUT,DELETE |
| 风情图片 | `/api/vibe-images`, `/api/vibe-images/:id` | GET,POST,PUT,DELETE |
| 页脚联系 | `/api/footer-contacts`, `/api/footer-contacts/:id` | GET,POST,PUT,DELETE |
| 站点统计 | `/api/stats` | GET, PUT |
| 文件上传 | `/api/upload` | POST (multipart) |

## 特色设计

- **极光星空背景**: Canvas 实时渲染，随滚动呈现天空→云层→海面→深海
- **开场动画**: Logo 居中浮现 → 艺术字从 Logo 内部滑出 → Header 降下 → "下滑以开始"
- **自定义光标**: 变色圆点 + 极光拖尾粒子
- **Lenis 平滑滚动**: 阻尼惯性滚动，隐藏原生滚动条
- **左侧竖链导航**: 发光游标精确指示阅读位置
- **瀑布流画廊**: 图片自动左右滚动，左右渐变淡入淡出
- **灯箱查看**: 背景虚化，洋流继续流动

## 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `PORT` | `3001` | 后端服务端口 |
| `JWT_SECRET` | `itstudio-showcase-secret-key-2026` | JWT 签名密钥 |
