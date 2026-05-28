import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { useContentLoader } from '../hooks/useContentLoader';
import { fetchPosts, fetchProjects } from '../lib/content';
import { isSupabaseConfigured } from '../lib/supabase';
import type { BlogPost, Project } from '../types/content';
import { ContentContext } from './content-context';
import type { ContentContextValue } from './content-types';

export function ContentProvider({ children }: { children: ReactNode }) {
	const [projects, setProjects] = useState<Project[]>([]);
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
	const [error, setError] = useState<string | null>(null);

	const reload = useCallback(async () => {
		if (!isSupabaseConfigured) {
			setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const [loadedProjects, loadedPosts] = await Promise.all([fetchProjects(), fetchPosts()]);
			setProjects(loadedProjects);
			setPosts(loadedPosts);
		} catch (loadError) {
			const message = loadError instanceof Error ? loadError.message : 'Failed to load content';
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useContentLoader(reload);

	const value = useMemo<ContentContextValue>(
		() => ({ projects, posts, isLoading, error, reload }),
		[projects, posts, isLoading, error, reload]
	);

	return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
