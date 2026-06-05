'use client';

import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { CodeBlock } from '@/components/CodeBlock';

interface MarkdownContentProps {
	markdown: string;
}

const headingClassName = {
	h1: 'mt-6 mb-4 border-b border-panel-border pb-2 text-3xl font-semibold text-text-primary first:mt-0',
	h2: 'mt-6 mb-4 border-b border-panel-border pb-2 text-2xl font-semibold text-text-primary first:mt-0',
	h3: 'mt-4 mb-2 text-xl font-semibold text-text-primary',
	h4: 'mt-4 mb-2 text-base font-semibold text-text-primary',
	h5: 'mt-4 mb-2 text-sm font-semibold text-text-primary',
	h6: 'mt-4 mb-2 text-sm font-semibold text-text-muted'
} as const;

const components: Components = {
	h1: ({ children }) => <h1 className={headingClassName.h1}>{children}</h1>,
	h2: ({ children }) => <h2 className={headingClassName.h2}>{children}</h2>,
	h3: ({ children }) => <h3 className={headingClassName.h3}>{children}</h3>,
	h4: ({ children }) => <h4 className={headingClassName.h4}>{children}</h4>,
	h5: ({ children }) => <h5 className={headingClassName.h5}>{children}</h5>,
	h6: ({ children }) => <h6 className={headingClassName.h6}>{children}</h6>,
	p: ({ children }) => <p className='mb-4 leading-relaxed text-text-secondary last:mb-0'>{children}</p>,
	strong: ({ children }) => <strong className='font-semibold text-text-primary'>{children}</strong>,
	em: ({ children }) => <em className='italic'>{children}</em>,
	del: ({ children }) => <del className='text-text-muted line-through'>{children}</del>,
	blockquote: ({ children }) => (
		<blockquote className='my-4 border-l-4 border-panel-border pl-4 text-text-muted'>{children}</blockquote>
	),
	hr: () => <hr className='my-6 border-0 border-t border-panel-border' />,
	ul: ({ children }) => <ul className='my-4 list-disc space-y-1 pl-6 text-text-secondary'>{children}</ul>,
	ol: ({ children }) => <ol className='my-4 list-decimal space-y-1 pl-6 text-text-secondary'>{children}</ol>,
	li: ({ children, className }) => <li className={`leading-relaxed ${className ?? ''}`.trim()}>{children}</li>,
	input: ({ checked, disabled, type }) => {
		if (type !== 'checkbox') return null;
		return <input type='checkbox' checked={checked} disabled={disabled} readOnly className='mr-2 accent-accent' />;
	},
	a: ({ href, children }) => (
		<a
			href={href}
			target='_blank'
			rel='noreferrer'
			className='text-accent underline underline-offset-2 transition-colors hover:text-accent-soft'>
			{children}
		</a>
	),
	img: ({ src, alt }) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img src={src} alt={alt ?? ''} className='my-4 max-w-full rounded-lg' />
	),
	table: ({ children }) => (
		<div className='my-4 overflow-x-auto'>
			<table className='w-full border-collapse text-sm text-text-secondary'>{children}</table>
		</div>
	),
	thead: ({ children }) => <thead>{children}</thead>,
	tbody: ({ children }) => <tbody>{children}</tbody>,
	tr: ({ children }) => <tr className='border-t border-panel-border'>{children}</tr>,
	th: ({ children }) => (
		<th className='border border-panel-border bg-panel-muted px-3 py-2 text-left font-semibold text-text-primary'>
			{children}
		</th>
	),
	td: ({ children }) => <td className='border border-panel-border px-3 py-2'>{children}</td>,
	code: ({ className, children }) => {
		if (className?.startsWith('language-')) {
			const language = className.slice('language-'.length);
			const code = String(children).replace(/\n$/, '');
			return <CodeBlock code={code} language={language} />;
		}
		return <code className='rounded bg-panel-muted px-1.5 py-0.5 font-mono text-sm text-text-primary'>{children}</code>;
	},
	pre: ({ children }) => <>{children}</>
};

export function MarkdownContent({ markdown }: MarkdownContentProps) {
	if (!markdown.trim()) {
		return <p className='text-sm text-text-muted'>Nothing to preview yet.</p>;
	}

	return (
		<div className='markdown-body'>
			<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
				{markdown}
			</ReactMarkdown>
		</div>
	);
}
