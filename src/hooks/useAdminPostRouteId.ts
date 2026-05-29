'use client';

import { useParams, usePathname } from 'next/navigation';

function getRouteIdFromPathname(pathname: string): string | undefined {
	const segments = pathname.split('/').filter(Boolean);
	const postsIndex = segments.indexOf('posts');
	if (postsIndex === -1) return undefined;

	return segments[postsIndex + 1];
}

/**
 * Post route id (`new` or slug). Uses dynamic params when present (e.g. /posts/[id]),
 * otherwise parses /admin/posts/{id} from the pathname (required for /posts/new).
 */
export function useAdminPostRouteId(): string | undefined {
	const params = useParams<{ id: string }>();
	const pathname = usePathname();

	return params.id ?? getRouteIdFromPathname(pathname);
}
