import { MarkdownContent } from '@/components/MarkdownContent';
import { TagChip } from '@/components/Tag';
import type { BlogPost } from '@/types/content';

interface PostArticleProps {
	post: BlogPost;
}

export function PostArticle({ post }: PostArticleProps) {
	return (
		<article className='rounded-xl bg-panel p-6 shadow-soft'>
			<header>
				<h1 className='text-3xl font-semibold text-text-primary'>{post.title}</h1>
				<p className='mt-2 text-sm text-text-muted'>
					{new Date(post.publishedAt).toLocaleDateString()} · {post.readTime}
				</p>
				<p className='mt-3 text-base leading-relaxed text-text-secondary'>{post.summary}</p>
				<div className='mt-4 flex flex-wrap gap-2'>
					{post.tags.map(tag => (
						<TagChip key={`${post.id}-${tag}`} tag={tag} />
					))}
				</div>
			</header>

			<div className='mt-6'>
				<MarkdownContent markdown={post.content} />
			</div>
		</article>
	);
}
