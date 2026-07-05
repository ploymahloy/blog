import { BlogList } from '@/components/BlogList';
import { getPosts } from '@/lib/content-server';

export default async function BlogPage() {
	const posts = await getPosts();

	return <BlogList posts={posts} />;
}
