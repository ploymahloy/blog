'use client';

import { createBrowserClient } from '@supabase/ssr';

import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from '@/lib/env';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
	if (!isSupabaseConfigured) {
		throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
	}

	if (!browserClient) {
		browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
	}

	return browserClient;
}
