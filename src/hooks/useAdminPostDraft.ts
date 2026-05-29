'use client';

import { useLayoutEffect, useState } from 'react';

import { loadAdminPostDraft } from '@/lib/admin-draft-storage';
import type { BlogPost } from '@/types/content';

interface UseAdminPostDraftResult {
	post: BlogPost | null;
	hasCheckedStorage: boolean;
}

export function useAdminPostDraft(routeId: string | undefined): UseAdminPostDraftResult {
	const [post, setPost] = useState<BlogPost | null>(null);
	const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

	useLayoutEffect(() => {
		if (!routeId) {
			setPost(null);
			setHasCheckedStorage(false);
			return;
		}

		setPost(loadAdminPostDraft(routeId));
		setHasCheckedStorage(true);
	}, [routeId]);

	return { post, hasCheckedStorage };
}
