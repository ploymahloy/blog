export interface Project {
  id: string;
  title: string;
  summary: string;
  stack: string[];
  repoUrl: string;
  liveUrl?: string;
  inProgress?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  content: string;
}
