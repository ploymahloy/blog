import type { BlogPost, Project } from '../types/content';

export interface ContentContextValue {
	projects: Project[];
	posts: BlogPost[];
	isLoading: boolean;
	error: string | null;
	reload: () => Promise<void>;
}
