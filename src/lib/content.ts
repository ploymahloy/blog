import type { SupabaseClient } from '@supabase/supabase-js';

import type { BlogPost, Project } from '@/types/content';

interface ProjectRow {
	id: string;
	title: string;
	summary: string;
	stack: string[];
	repo_url: string;
	live_url: string | null;
	in_progress: boolean;
	sort_order: number;
	updated_at: string;
}

interface BlogPostRow {
	id: string;
	title: string;
	summary: string;
	published_at: string;
	read_time: string;
	tags: string[];
	content: string;
	updated_at: string;
}

function mapProject(row: ProjectRow): Project {
	return {
		id: row.id,
		title: row.title,
		summary: row.summary,
		stack: row.stack.map(item => item.trim().toLowerCase()),
		repoUrl: row.repo_url,
		liveUrl: row.live_url ?? undefined,
		inProgress: row.in_progress ?? false
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

function projectToRow(project: Project): Omit<ProjectRow, 'updated_at' | 'sort_order'> {
	return {
		id: project.id,
		title: project.title,
		summary: project.summary,
		stack: project.stack,
		repo_url: project.repoUrl,
		live_url: project.liveUrl ?? null,
		in_progress: project.inProgress ?? false
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

export async function fetchProjects(client: SupabaseClient): Promise<Project[]> {
	const { data, error } = await client.from('projects').select('*').order('sort_order', { ascending: true });

	if (error) throw new Error(error.message);
	return (data as ProjectRow[]).map(mapProject);
}

export async function fetchPosts(client: SupabaseClient): Promise<BlogPost[]> {
	const { data, error } = await client.from('blog_posts').select('*').order('published_at', { ascending: false });

	if (error) throw new Error(error.message);
	return (data as BlogPostRow[]).map(mapBlogPost);
}

export async function fetchPostById(client: SupabaseClient, id: string): Promise<BlogPost | null> {
	const { data, error } = await client.from('blog_posts').select('*').eq('id', id).maybeSingle();

	if (error) throw new Error(error.message);
	if (!data) return null;
	return mapBlogPost(data as BlogPostRow);
}

async function nextProjectSortOrder(client: SupabaseClient): Promise<number> {
	const { data, error } = await client
		.from('projects')
		.select('sort_order')
		.order('sort_order', { ascending: false })
		.limit(1)
		.maybeSingle();

	if (error) throw new Error(error.message);
	if (!data) return 0;
	return (data as Pick<ProjectRow, 'sort_order'>).sort_order + 1;
}

export async function upsertProject(client: SupabaseClient, project: Project): Promise<void> {
	const row = projectToRow(project);
	const { data: existing, error: fetchError } = await client.from('projects').select('id').eq('id', project.id).maybeSingle();

	if (fetchError) throw new Error(fetchError.message);

	if (existing) {
		const { error } = await client.from('projects').update(row).eq('id', project.id);
		if (error) throw new Error(error.message);
		return;
	}

	const sortOrder = await nextProjectSortOrder(client);
	const { error } = await client.from('projects').insert({ ...row, sort_order: sortOrder });
	if (error) throw new Error(error.message);
}

export async function reorderProjects(client: SupabaseClient, orderedIds: string[]): Promise<void> {
	const updates = orderedIds.map((id, index) =>
		client.from('projects').update({ sort_order: index }).eq('id', id)
	);
	const results = await Promise.all(updates);
	const failed = results.find(result => result.error);
	if (failed?.error) throw new Error(failed.error.message);
}

export async function deleteProject(client: SupabaseClient, id: string): Promise<void> {
	const { error } = await client.from('projects').delete().eq('id', id);
	if (error) throw new Error(error.message);
}

export async function upsertBlogPost(client: SupabaseClient, post: BlogPost): Promise<void> {
	const { error } = await client.from('blog_posts').upsert(blogPostToRow(post), { onConflict: 'id' });
	if (error) throw new Error(error.message);
}

export async function deleteBlogPost(client: SupabaseClient, id: string): Promise<void> {
	const { error } = await client.from('blog_posts').delete().eq('id', id);
	if (error) throw new Error(error.message);
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
	return SLUG_PATTERN.test(slug);
}
