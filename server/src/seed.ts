import bcrypt from 'bcryptjs';
import db, { initDB } from './db.js';

(async () => {
  await initDB();

  console.log('[Seed] 开始填充初始数据...');

  // 1. 默认管理员账号
  const passwordHash = bcrypt.hashSync('admin123', 10);
  const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!existingAdmin) {
    db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('admin', passwordHash);
    console.log('[Seed] ✓ 默认管理员账号: admin / admin123');
  }

  // 2. 站点统计
  db.prepare('DELETE FROM stats').run();
  const statsData: [string, string, string][] = [
    ['founded_year', '2002', '工作室成立年份'],
    ['member_count', '500', '历届技术骨干总数'],
    ['placement_rate', '98.2', 'C9保研/大厂率'],
    ['project_count', '50', '上线校园系统数量'],
    ['live_status', '西海岸校区 58 创新创业工坊算力集群在线 · CSP 认证服务运行中 · CCF 海大学生分会正式换届', '顶部状态栏滚动文字'],
    ['qq_group', '589598653', '招新QQ群号'],
    ['email', 'contact@itstudio.club', '联系邮箱'],
    ['address', '山东省青岛市古镇口核心区三沙路2000号 西海岸校区', '线下地址'],
  ];
  for (const [key, value, desc] of statsData) {
    db.prepare('INSERT INTO stats (key, value, description) VALUES (?, ?, ?)').run(key, value, desc);
  }
  console.log('[Seed] ✓ 站点统计');

  // 3. 组织架构干部
  db.prepare('DELETE FROM org_leaders').run();
  const orgLeadersData = [
    ['委员会', '会长', '李明', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', '全局统筹 / C9保研', 0],
    ['委员会', '副会长', '张华', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', '外联合作', 1],
    ['委员会', '团支书', '王强', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', '团建与财物', 2],
    ['委员会', '站长', '赵科', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80', '分管教学 / 腾讯 Offer', 3],
    ['委员会', '副站长', '孙杰', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80', '分管研发', 4],
    ['FOSS部', '部长', '刘开源', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80', 'Rust / Linux', 5],
    ['FOSS部', '副部长', '张自由', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', 'Arch / NixOS', 6],
    ['系统维护部', '部长', '陈运维', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=80', 'K8s / 网络安全', 7],
    ['系统维护部', '副部长', '黄安全', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', '渗透测试 / CTF', 8],
    ['宣传部', '部长', '周设计', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80', 'Figma / 视觉传达', 9],
    ['宣传部', '副部长', '吴文案', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80', '新媒体运营', 10],
    ['程序部', '部长', '吴后端', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', 'Java / Go', 11],
    ['Web部', '部长', '郑前端', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', 'React / Next.js', 12],
    ['Web部', '副部长', '冯样式', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80', 'CSS / Tailwind', 13],
    ['游戏部', '部长', '马游戏', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', 'Unity / C#', 14],
    ['APP部', '部长', '胡移动', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=80', 'Flutter / Android', 15],
    ['iOS部', '部长', '林苹果', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80', 'Swift / SwiftUI', 16],
    ['鸿蒙部', '部长', '郭鸿蒙', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80', 'HarmonyOS / ArkTS', 17],
    ['鸿蒙部', '副部长', '钱信创', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', 'OpenHarmony / 龙芯', 18],
  ];
  for (const row of orgLeadersData) {
    db.prepare('INSERT INTO org_leaders (dept, title, name, avatar, tag, sort_order) VALUES (?, ?, ?, ?, ?, ?)').run(...row);
  }
  console.log('[Seed] ✓ 组织架构干部');

  // 4. 年级
  db.prepare('DELETE FROM grades').run();
  for (const y of ['2026', '2025', '2024', '2023']) {
    db.prepare('INSERT OR IGNORE INTO grades (year) VALUES (?)').run(y);
  }
  console.log('[Seed] ✓ 年级数据');

  // 5. 成员
  db.prepare('DELETE FROM members').run();
  const membersData = [
    ['2026', '委员会', '会长', '李明', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', '代码改变世界', '保研C9', '', 0],
    ['2026', '委员会', '副会长', '张华', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', 'Stay Hungry, Stay Foolish', '大厂Offer', '', 1],
    ['2026', '委员会', '团支书', '王强', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', '知行合一', '保研C9', '', 2],
    ['2026', '委员会', '站长', '赵科', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80', '技术为本，创新为魂', '大厂Offer', '', 3],
    ['2026', '委员会', '副站长', '孙杰', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80', '追求卓越，永不止步', '保研C9', '', 4],
    ['2026', 'FOSS部', '部长', '刘开源', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80', '自由软件，自由思想', '开源骨干', '', 5],
    ['2026', '系统维护部', '部长', '陈运维', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&q=80', '稳定压倒一切', '保研C9', '', 6],
    ['2026', '宣传部', '部长', '周设计', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80', '设计源于生活', '大厂Offer', '', 7],
    ['2026', '程序部', '部长', '吴后端', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', 'Talk is cheap, show me the code', '本校保研', '', 8],
    ['2026', 'Web部', '部长', '郑前端', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', '像素级完美', '大厂Offer', '', 9],
  ];
  for (const row of membersData) {
    db.prepare('INSERT INTO members (year, dept, title, name, avatar, dest, badge, tech, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(...row);
  }
  console.log('[Seed] ✓ 成员数据');

  // 5. 成果
  db.prepare('DELETE FROM achievements').run();
  const achievementsData = [
    ['2026', 'MikuDB 高性能文档数据库开源发布', '基于 Rust 语言构建的高性能文档数据库项目，获得 GitHub 开发者社区高星关注与 Rust 社区认可。', '["Rust","Database","OpenSource"]', 'https://github.com/ITStudioOUC', '查看仓库', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 0],
    ['2025', 'OUC 生存指北 Wiki 知识库上线', '由爱特团队精心整理与编写的开源海大生存指南，帮助数万名海大学子解决日常选课、选导师与生活疑难。', '["VitePress","Markdown","Wiki"]', 'https://wiki.itstudio.club/', '访问 Wiki', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 1],
    ['2024', '全国 OpenHarmony 极客开发大赛金奖', '基于开源鸿蒙系统的海况数据实时感知终端，斩获全国总决赛一等奖，推动软硬件产学研结合。', '["HarmonyOS","C/C++","IoT"]', 'https://www.ccf.org.cn/', '了解详情', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 2],
  ];
  for (const row of achievementsData) {
    db.prepare('INSERT INTO achievements (year, title, "desc", tags, link, link_text, img, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(...row);
  }
  console.log('[Seed] ✓ 成果数据');

  // 6. 导师
  db.prepare('DELETE FROM mentors').run();
  const mentorsData = [
    ['团委指导老师', '高峰 老师', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', '学生科创指导 / 思想政治教育', '信息科学与工程学部', 'gaofeng@ouc.edu.cn', '西海岸校区58工坊201', '团委书记', 0],
    ['技术指导老师', '董军宇 教授', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80', '计算机视觉 / 海洋大数据分析', '信息科学与工程学部', 'dongjy@ouc.edu.cn', '西海岸校区信息楼B308', '教授 / 博士生导师', 1],
    ['企业指导老师', '刘架构 先生', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80', '云原生架构 / 开源生态产学研', '海信集团 / 阿里云', 'liujg@hisense.com', '海信研发中心', '资深架构师', 2],
  ];
  for (const row of mentorsData) {
    db.prepare('INSERT INTO mentors (title, name, avatar, research, college, email, office, academic_title, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(...row);
  }
  console.log('[Seed] ✓ 导师数据');

  // 7. FAQ
  db.prepare('DELETE FROM faqs').run();
  const faqsData = [
    ['零基础大一新生可以加入爱特工作室吗？', '完全可以！爱特每年纳新均面向全校各专业新生。我们拥有完善的基础教学培养体系（六大方向），只要你对技术有热情、敢于探索，学长学姐带你从零成长。', 0],
    ['加入爱特之后会有怎样的日常安排？', '日常包括每周的技术方向例会、项目代码研讨、机房实践以及极客沙龙。工作室在 58 工坊拥有专属硬件工位与算力支持，随时为你提供沉浸的学习氛围。', 1],
    ['工作室的招新考核流程是怎样的？', '通常分为宣讲会 → 提交纳新作业/小项目 → 现场面试答辩。各部门作业注重动手实践能力而非死记硬背。', 2],
  ];
  for (const row of faqsData) {
    db.prepare('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)').run(...row);
  }
  console.log('[Seed] ✓ FAQ 数据');

  // 8. 社团活动
  db.prepare('DELETE FROM activities').run();
  const activitiesData = [
    ['OpenClaw 高校局科普活动', '联合阿里云与 CCF 海大学生分会举办开源 AI 智能体科普讲座。', 'https://www.ccf.org.cn/', 'M13 10V3L4 14h7v7l9-11h-7z', 0],
    ['CSP 软件能力认证培训', '承办海大 CSP 认证报名宣传与考前算法刷题冲刺培训。', 'https://www.ccf.org.cn/', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', 1],
    ['CCF 走进中国海洋大学', '邀请国内著名专家学者开展学术讲座，与青年学生面对面交流。', 'https://www.ccf.org.cn/', 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', 2],
    ['海边极客黑客马拉松', '48小时极限开发，将创意孵化为可运行的校园原型系统。', 'https://github.com/ITStudioOUC', 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', 3],
  ];
  for (const row of activitiesData) {
    db.prepare('INSERT INTO activities (title, "desc", link, svg_d, sort_order) VALUES (?, ?, ?, ?, ?)').run(...row);
  }
  console.log('[Seed] ✓ 社团活动数据');

  console.log('[Seed] 数据填充完成！');
  console.log('[Seed] 管理员账号: admin / admin123');
})();
