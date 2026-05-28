import { useMemo, useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
	code: string;
	language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
	const [isCopied, setIsCopied] = useState(false);
	const trimmedCode = useMemo(() => code.trim(), [code]);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(trimmedCode);
		setIsCopied(true);
		window.setTimeout(() => setIsCopied(false), 1500);
	};

	return (
		<div className='group relative mt-4'>
			<button
				type='button'
				onClick={handleCopy}
				className='absolute right-3 top-3 z-10 rounded-md border border-panel-border bg-surface px-2.5 py-1 text-xs text-text-secondary transition-colors hover:border-accent hover:text-accent'>
				{isCopied ? 'Copied' : 'Copy'}
			</button>
			<button
				type='button'
				onClick={handleCopy}
				className='block w-full cursor-copy overflow-x-auto rounded-xl border border-panel-border bg-[#1f2430] p-4 text-left shadow-soft'>
				<Highlight theme={themes.vsDark} code={trimmedCode} language={language}>
					{({ className, style, tokens, getLineProps, getTokenProps }) => (
						<pre className={className} style={{ ...style, margin: 0 }}>
							{tokens.map((line, lineIndex) => (
								<div key={lineIndex} {...getLineProps({ line })}>
									{line.map((token, tokenIndex) => (
										<span key={`${lineIndex}-${tokenIndex}`} {...getTokenProps({ token })} />
									))}
								</div>
							))}
						</pre>
					)}
				</Highlight>
			</button>
		</div>
	);
}
