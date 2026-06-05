import type { BlogPost } from '@/types/content';

const draftKey = (routeId: string) => `admin-post-draft:${routeId}`;

function canUseSessionStorage(): boolean {
	return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

export function saveAdminPostDraft(routeId: string, post: BlogPost) {
	if (!canUseSessionStorage()) return;

	const payload = JSON.stringify(post);
	sessionStorage.setItem(draftKey(routeId), payload);

	if (routeId === 'new' && post.id) {
		sessionStorage.setItem(draftKey(post.id), payload);
	}
}

export function loadAdminPostDraft(routeId: string): BlogPost | null {
	if (!canUseSessionStorage()) return null;

	const raw = sessionStorage.getItem(draftKey(routeId));
	if (!raw) return null;

	try {
		return JSON.parse(raw) as BlogPost;
	} catch {
		return null;
	}
}

export function clearAdminPostDraft(routeId: string, postId?: string) {
	if (!canUseSessionStorage()) return;

	sessionStorage.removeItem(draftKey(routeId));
	if (postId && postId !== routeId) {
		sessionStorage.removeItem(draftKey(postId));
	}
}
