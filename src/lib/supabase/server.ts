import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from '@/lib/env';

export async function createSupabaseServerClient() {
	if (!isSupabaseConfigured) {
		throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
	}

	const cookieStore = await cookies();

	return createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					for (const { name, value, options } of cookiesToSet) {
						cookieStore.set(name, value, options);
					}
				} catch {
					// setAll can fail in Server Components; middleware refreshes sessions.
				}
			}
		}
	});
}
