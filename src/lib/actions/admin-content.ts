'use server';

import { revalidatePath } from 'next/cache';

import { deleteBlogPost, deleteProject, reorderProjects, upsertBlogPost, upsertProject } from '@/lib/content';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { BlogPost, Project } from '@/types/content';

function revalidatePublicContent(postSlug?: string, previousSlug?: string) {
	revalidatePath('/');
	revalidatePath('/blog');

	if (postSlug) {
		revalidatePath(`/blog/${postSlug}`);
	}

	if (previousSlug && previousSlug !== postSlug) {
		revalidatePath(`/blog/${previousSlug}`);
	}
}

export async function saveProjectAction(project: Project) {
	const supabase = await createSupabaseServerClient();
	await upsertProject(supabase, project);
	revalidatePublicContent();
}

export async function deleteProjectAction(id: string) {
	const supabase = await createSupabaseServerClient();
	await deleteProject(supabase, id);
	revalidatePublicContent();
}

export async function reorderProjectsAction(orderedIds: string[]) {
	const supabase = await createSupabaseServerClient();
	await reorderProjects(supabase, orderedIds);
	revalidatePublicContent();
}

export async function publishBlogPostAction(post: BlogPost, previousSlug?: string) {
	const supabase = await createSupabaseServerClient();
	await upsertBlogPost(supabase, post);
	revalidatePublicContent(post.id, previousSlug);
}

export async function deleteBlogPostAction(id: string) {
	const supabase = await createSupabaseServerClient();
	await deleteBlogPost(supabase, id);
	revalidatePublicContent(id);
}
