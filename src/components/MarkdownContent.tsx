'use client';

import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { CodeBlock } from '@/components/CodeBlock';

interface MarkdownContentProps {
	markdown: string;
}

const components: Components = {
	p: ({ children }) => <p className='leading-relaxed text-text-secondary'>{children}</p>,
	h2: ({ children }) => <h2 className='text-lg font-semibold text-text-primary'>{children}</h2>,
	h3: ({ children }) => <h3 className='text-lg font-semibold text-text-primary'>{children}</h3>,
	ul: ({ children }) => <ul className='list-disc space-y-2 pl-6 text-text-secondary'>{children}</ul>,
	ol: ({ children }) => <ol className='list-decimal space-y-2 pl-6 text-text-secondary'>{children}</ol>,
	li: ({ children }) => <li>{children}</li>,
	a: ({ href, children }) => (
		<a
			href={href}
			target='_blank'
			rel='noreferrer'
			className='text-accent underline underline-offset-4 transition-colors hover:text-accent-soft'>
			{children}
		</a>
	),
	code: ({ className, children }) => {
		if (className?.startsWith('language-')) {
			const language = className.slice('language-'.length);
			const code = String(children).replace(/\n$/, '');
			return <CodeBlock code={code} language={language} />;
		}
		return (
			<code className='rounded bg-panel-muted px-1.5 py-0.5 font-mono text-sm text-text-primary'>{children}</code>
		);
	},
	pre: ({ children }) => <>{children}</>
};

export function MarkdownContent({ markdown }: MarkdownContentProps) {
	if (!markdown.trim()) {
		return <p className='text-sm text-text-muted'>Nothing to preview yet.</p>;
	}

	return (
		<div className='space-y-4'>
			<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
				{markdown}
			</ReactMarkdown>
		</div>
	);
}
