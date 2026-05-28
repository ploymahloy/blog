export interface Project {
  id: string;
  title: string;
  summary: string;
  stack: string[];
  repoUrl: string;
  liveUrl?: string;
  featuredReason: string;
}

export interface CodeArticleBlock {
  type: "code";
  language: string;
  code: string;
}

export interface ParagraphArticleBlock {
  type: "paragraph";
  content: string;
}

export interface HeadingArticleBlock {
  type: "heading";
  content: string;
}

export interface ListArticleBlock {
  type: "list";
  items: string[];
}

export interface LinkArticleBlock {
  type: "link";
  content: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  content: ArticleBlock[];
}

export type ArticleBlock =
  | ParagraphArticleBlock
  | HeadingArticleBlock
  | ListArticleBlock
  | LinkArticleBlock
  | CodeArticleBlock;
