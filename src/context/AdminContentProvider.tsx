'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { fetchPosts, fetchProjects } from '@/lib/content';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { BlogPost, Project } from '@/types/content';
import { AdminContentContext } from '@/context/admin-content-context';

export function AdminContentProvider({ children }: { children: ReactNode }) {
	const [projects, setProjects] = useState<Project[]>([]);
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const reload = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const supabase = createSupabaseBrowserClient();
			const [loadedProjects, loadedPosts] = await Promise.all([fetchProjects(supabase), fetchPosts(supabase)]);
			setProjects(loadedProjects);
			setPosts(loadedPosts);
		} catch (loadError) {
			const message = loadError instanceof Error ? loadError.message : 'Failed to load content';
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void reload();
	}, [reload]);

	const value = useMemo(
		() => ({ projects, posts, isLoading, error, reload }),
		[projects, posts, isLoading, error, reload]
	);

	return <AdminContentContext.Provider value={value}>{children}</AdminContentContext.Provider>;
}
