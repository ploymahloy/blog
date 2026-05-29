'use client';

import { createContext } from 'react';

import type { BlogPost, Project } from '@/types/content';

export interface AdminContentContextValue {
	projects: Project[];
	posts: BlogPost[];
	isLoading: boolean;
	error: string | null;
	reload: () => Promise<void>;
}

export const AdminContentContext = createContext<AdminContentContextValue | null>(null);
