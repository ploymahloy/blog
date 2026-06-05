'use client';

import { useState } from 'react';

import { MarkdownContent } from '@/components/MarkdownContent';

const inputClassName =
	'w-full rounded-lg bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

type EditorTab = 'write' | 'preview';

interface MarkdownEditorProps {
	value: string;
	onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
	const [activeTab, setActiveTab] = useState<EditorTab>('write');

	return (
		<div>
			<div className='mb-2 flex items-center justify-between gap-2'>
				<p className='text-sm font-medium text-text-secondary'>Content</p>
				<div className='flex rounded-md bg-surface p-0.5'>
					<button
						type='button'
						onClick={() => setActiveTab('write')}
						className={`rounded px-3 py-1 text-sm transition-colors ${
							activeTab === 'write' ? 'bg-panel-muted text-text-primary' : 'text-text-secondary hover:text-text-primary'
						}`}>
						Write
					</button>
					<button
						type='button'
						onClick={() => setActiveTab('preview')}
						className={`rounded px-3 py-1 text-sm transition-colors ${
							activeTab === 'preview' ? 'bg-panel-muted text-text-primary' : 'text-text-secondary hover:text-text-primary'
						}`}>
						Preview
					</button>
				</div>
			</div>

			{activeTab === 'write' ?
				<textarea
					value={value}
					onChange={event => onChange(event.target.value)}
					rows={20}
					className={`${inputClassName} font-mono`}
					placeholder='Write your post in markdown…'
				/>
			:	<div className='min-h-[20rem] rounded-xl border border-panel-muted bg-panel p-4'>
					<MarkdownContent markdown={value} />
				</div>
			}
		</div>
	);
}
