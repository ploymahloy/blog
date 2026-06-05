import { isValidSlug } from '@/lib/content';
import type { BlogPost } from '@/types/content';

export function parseTags(tagsText: string): string[] {
	return tagsText
		.split(',')
		.map(tag => tag.trim())
		.filter(Boolean);
}

export function validatePostDraft(post: BlogPost): string | null {
	const slug = post.id.trim();
	if (!slug || !isValidSlug(slug)) {
		return 'ID must be a kebab-case slug.';
	}

	if (!post.title.trim() || !post.summary.trim() || !post.readTime.trim()) {
		return 'Title, summary, and read time are required.';
	}

	return null;
}

export function buildPostFromForm(post: BlogPost, tagsText: string): BlogPost {
	const slug = post.id.trim();
	return {
		...post,
		id: slug,
		tags: parseTags(tagsText),
		content: post.content
	};
}

export function getAdminPostEditorPath(routeId: string): string {
	return routeId === 'new' ? '/admin/posts/new' : `/admin/posts/${routeId}`;
}
