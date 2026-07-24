// 成员
export interface Member {
  id: number;
  year: string;
  dept: string;
  title: string;
  name: string;
  avatar: string;
  dest: string;
  badge: string;
  tech: string;
  sort_order: number;
}

// 成果
export interface Achievement {
  id: number;
  year: string;
  title: string;
  desc: string;
  tags: string[];
  link: string;
  link_text: string;
  img: string;
  sort_order: number;
}

// FAQ
export interface Faq {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
}

// 文章
export interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  html?: string;
  published: number;
  created_at: string;
  updated_at: string;
}

// 组织架构干部
export interface OrgLeader {
  id: number;
  dept: string;
  title: string;
  name: string;
  avatar: string;
  tag: string;
  sort_order: number;
}

// 导师
export interface Mentor {
  id: number;
  title: string;
  name: string;
  avatar: string;
  research: string;
  college: string;
  email: string;
  office: string;
  academic_title: string;
  sort_order: number;
}

// 站点统计
export interface SiteStats {
  founded_year: string;
  member_count: string;
  placement_rate: string;
  project_count: string;
  live_status: string;
  icp_number: string;
  gongan_number: string;
  qq_group: string;
  email: string;
  address: string;
  [key: string]: string;
}
