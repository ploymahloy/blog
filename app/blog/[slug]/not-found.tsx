import Link from 'next/link';

export default function BlogPostNotFound() {
	return (
		<section className='mx-auto w-full max-w-4xl px-4 py-10 sm:px-6'>
			<p className='text-text-secondary'>Post not found.</p>
			<Link href='/blog' className='mt-4 inline-block text-accent hover:text-accent-soft'>
				Back to blog
			</Link>
		</section>
	);
}
