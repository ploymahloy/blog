import type { ArticleBlock, BlogPost, Project } from '../types/content';

import { supabase } from './supabase';

interface ProjectRow {
	id: string;
	title: string;
	summary: string;
	stack: string[];
	repo_url: string;
	live_url: string | null;
	updated_at: string;
}

interface BlogPostRow {
	id: string;
	title: string;
	summary: string;
	published_at: string;
	read_time: string;
	tags: string[];
	content: ArticleBlock[];
	updated_at: string;
}

function mapProject(row: ProjectRow): Project {
	return {
		id: row.id,
		title: row.title,
		summary: row.summary,
		stack: row.stack,
		repoUrl: row.repo_url,
		liveUrl: row.live_url ?? undefined
	};
}

function mapBlogPost(row: BlogPostRow): BlogPost {
	return {
		id: row.id,
		title: row.title,
		summary: row.summary,
		publishedAt: row.published_at,
		readTime: row.read_time,
		tags: row.tags,
		content: row.content
	};
}

function projectToRow(project: Project): Omit<ProjectRow, 'updated_at'> {
	return {
		id: project.id,
		title: project.title,
		summary: project.summary,
		stack: project.stack,
		repo_url: project.repoUrl,
		live_url: project.liveUrl ?? null
	};
}

function blogPostToRow(post: BlogPost): Omit<BlogPostRow, 'updated_at'> {
	return {
		id: post.id,
		title: post.title,
		summary: post.summary,
		published_at: post.publishedAt,
		read_time: post.readTime,
		tags: post.tags,
		content: post.content
	};
}

export async function fetchProjects(): Promise<Project[]> {
	const { data, error } = await supabase.from('projects').select('*').order('title');

	if (error) throw new Error(error.message);
	return (data as ProjectRow[]).map(mapProject);
}

export async function fetchPosts(): Promise<BlogPost[]> {
	const { data, error } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });

	if (error) throw new Error(error.message);
	return (data as BlogPostRow[]).map(mapBlogPost);
}

export async function fetchPostById(id: string): Promise<BlogPost | null> {
	const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).maybeSingle();

	if (error) throw new Error(error.message);
	if (!data) return null;
	return mapBlogPost(data as BlogPostRow);
}

export async function upsertProject(project: Project): Promise<void> {
	const { error } = await supabase.from('projects').upsert(projectToRow(project), { onConflict: 'id' });
	if (error) throw new Error(error.message);
}

export async function deleteProject(id: string): Promise<void> {
	const { error } = await supabase.from('projects').delete().eq('id', id);
	if (error) throw new Error(error.message);
}

export async function upsertBlogPost(post: BlogPost): Promise<void> {
	const { error } = await supabase.from('blog_posts').upsert(blogPostToRow(post), { onConflict: 'id' });
	if (error) throw new Error(error.message);
}

export async function deleteBlogPost(id: string): Promise<void> {
	const { error } = await supabase.from('blog_posts').delete().eq('id', id);
	if (error) throw new Error(error.message);
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
	return SLUG_PATTERN.test(slug);
}
