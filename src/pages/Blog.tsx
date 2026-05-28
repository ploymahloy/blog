import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { TagChip } from '../components/Tag';
import { posts } from '../data/posts';
import type { BlogPost } from '../types/content';

function sortByNewest(postA: BlogPost, postB: BlogPost) {
	return new Date(postB.publishedAt).getTime() - new Date(postA.publishedAt).getTime();
}

export function BlogPage() {
	const [query, setQuery] = useState('');
	const [activeTag, setActiveTag] = useState<string | null>(null);

	const availableTags = useMemo(() => [...new Set(posts.flatMap(post => post.tags))].sort(), []);

	const normalizedQuery = query.trim().toLowerCase();

	const filteredPosts = useMemo(() => {
		return posts
			.filter(post => {
				const matchesTag = activeTag ? post.tags.includes(activeTag) : true;
				if (!matchesTag) {
					return false;
				}

				if (!normalizedQuery) {
					return true;
				}

				const searchableText = `${post.title} ${post.tags.join(' ')}`.toLowerCase();
				return searchableText.includes(normalizedQuery);
			})
			.sort(sortByNewest);
	}, [activeTag, normalizedQuery]);

	const toggleTag = (tag: string) => {
		setActiveTag(currentTag => (currentTag === tag ? null : tag));
	};

	return (
		<section className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6'>
			<p className='text-sm uppercase tracking-wide text-accent'>Engineering Blog</p>
			<h1 className='mt-2 text-3xl font-semibold text-text-primary sm:text-4xl'>Posts</h1>
			<div className='mt-8 rounded-xl bg-panel p-4'>
				<label htmlFor='blog-search' className='mb-2 block text-sm text-text-secondary'>
					Search by title or tag
				</label>
				<input
					id='blog-search'
					type='search'
					value={query}
					onChange={event => setQuery(event.target.value)}
					placeholder='e.g. React, migrations, reliability'
					className='w-full rounded-lg bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
				/>
				<div className='mt-4 flex flex-wrap gap-2'>
					{availableTags.map(tag => (
						<TagChip key={tag} tag={tag} isActive={activeTag === tag} onClick={toggleTag} />
					))}
				</div>
			</div>

			<div className='mt-8 space-y-6'>
				{filteredPosts.length === 0 ?
					<p className='rounded-xl bg-panel p-6 text-text-secondary'>No posts matched your search.</p>
				:	filteredPosts.map(post => (
						<Link
							key={post.id}
							to={`/blog/${post.id}`}
							className='block rounded-xl bg-panel p-6 shadow-soft transition-colors hover:bg-panel-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'>
							<article>
								<header>
									<h2 className='text-2xl font-semibold text-text-primary'>{post.title}</h2>
									<p className='mt-2 text-sm text-text-muted'>
										{new Date(post.publishedAt).toLocaleDateString()} · {post.readTime}
									</p>
									<div className='mt-4 flex flex-wrap gap-2'>
										{post.tags.map(tag => (
											<TagChip key={`${post.id}-${tag}`} tag={tag} />
										))}
									</div>
								</header>
							</article>
						</Link>
					))
				}
			</div>
		</section>
	);
}
