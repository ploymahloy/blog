import { Navigate, useParams } from 'react-router-dom';

import { PostArticle } from '../components/PostArticle';
import { useContent } from '../hooks/useContent';

export function BlogPostPage() {
	const { id } = useParams<{ id: string }>();
	const { posts, isLoading } = useContent();
	const post = posts.find(item => item.id === id);

	if (isLoading) {
		return (
			<section className='mx-auto w-full max-w-4xl px-4 py-10 sm:px-6'>
				<p className='text-text-secondary'>Loading…</p>
			</section>
		);
	}

	if (!post) {
		return <Navigate to='/blog' replace />;
	}

	return (
		<section className='mx-auto w-full max-w-4xl px-4 py-10 sm:px-6'>
			<PostArticle post={post} />
		</section>
	);
}
