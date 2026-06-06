import { MarkdownContent } from '@/components/MarkdownContent';
import { stripDuplicatePostLead } from '@/lib/strip-duplicate-post-lead';
import type { BlogPost } from '@/types/content';

interface PostArticleProps {
	post: BlogPost;
}

export function PostArticle({ post }: PostArticleProps) {
	return (
		<article className='rounded-xl bg-panel p-6 shadow-soft'>
			<header>
				<h1 className='text-3xl font-semibold text-text-primary'>{post.title}</h1>
				<p className='mt-2 mb-4 text-sm text-text-muted'>
					{new Date(post.publishedAt).toLocaleDateString()} · {post.readTime}
				</p>
			</header>
			<MarkdownContent markdown={stripDuplicatePostLead(post.content, post.title, post.summary)} />
		</article>
	);
}
