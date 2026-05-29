import { createSupabaseServerClient } from '@/lib/supabase/server';
import { fetchPostById, fetchPosts, fetchProjects } from '@/lib/content';
import type { BlogPost, Project } from '@/types/content';

export async function getProjects(): Promise<Project[]> {
	const supabase = await createSupabaseServerClient();
	return fetchProjects(supabase);
}

export async function getPosts(): Promise<BlogPost[]> {
	const supabase = await createSupabaseServerClient();
	return fetchPosts(supabase);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
	const supabase = await createSupabaseServerClient();
	return fetchPostById(supabase, slug);
}
