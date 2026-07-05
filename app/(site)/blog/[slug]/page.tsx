import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PostArticle } from '@/components/PostArticle';
import { getPostBySlug } from '@/lib/content-server';

interface BlogPostPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) {
		return { title: 'Post not found' };
	}

	return {
		title: post.title,
		description: post.summary,
		openGraph: {
			title: post.title,
			description: post.summary,
			type: 'article',
			publishedTime: post.publishedAt
		}
	};
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	return (
		<section className='mx-auto w-full max-w-4xl px-4 py-10 sm:px-6'>
			<PostArticle post={post} />
		</section>
	);
}
