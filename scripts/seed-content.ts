/**
 * Seeds projects and blog_posts from src/data/*.ts
 *
 * Requires .env.local:
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Run: npm run seed
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { posts } from '../src/data/posts';
import { projects } from '../src/data/projects';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnvLocal() {
	const path = resolve(root, '.env.local');
	try {
		const raw = readFileSync(path, 'utf8');
		for (const line of raw.split('\n')) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith('#')) continue;
			const eq = trimmed.indexOf('=');
			if (eq === -1) continue;
			const key = trimmed.slice(0, eq).trim();
			const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
			if (!process.env[key]) process.env[key] = value;
		}
	} catch {
		// .env.local optional if vars already exported
	}
}

loadEnvLocal();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
	console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
	process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
	auth: { persistSession: false, autoRefreshToken: false }
});

async function seed() {
	const projectRows = projects.map(project => ({
		id: project.id,
		title: project.title,
		summary: project.summary,
		stack: project.stack,
		repo_url: project.repoUrl,
		live_url: project.liveUrl ?? null
	}));

	const { error: projectsError } = await supabase.from('projects').upsert(projectRows, { onConflict: 'id' });
	if (projectsError) {
		console.error('Failed to seed projects:', projectsError.message);
		process.exit(1);
	}
	console.log(`Seeded ${projectRows.length} projects`);

	const postRows = posts.map(post => ({
		id: post.id,
		title: post.title,
		summary: post.summary,
		published_at: post.publishedAt,
		read_time: post.readTime,
		tags: post.tags,
		content: post.content
	}));

	const { error: postsError } = await supabase.from('blog_posts').upsert(postRows, { onConflict: 'id' });
	if (postsError) {
		console.error('Failed to seed blog_posts:', postsError.message);
		process.exit(1);
	}
	console.log(`Seeded ${postRows.length} blog posts`);
	console.log('Done.');
}

seed();
