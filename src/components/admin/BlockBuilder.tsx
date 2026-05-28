import type { ArticleBlock } from '../../types/content';

const BLOCK_TYPES: ArticleBlock['type'][] = ['paragraph', 'heading', 'list', 'link', 'code'];

const inputClassName =
	'w-full rounded-lg bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

function createEmptyBlock(type: ArticleBlock['type']): ArticleBlock {
	switch (type) {
		case 'paragraph':
			return { type: 'paragraph', content: '' };
		case 'heading':
			return { type: 'heading', content: '' };
		case 'link':
			return { type: 'link', content: '' };
		case 'code':
			return { type: 'code', language: 'text', code: '' };
		case 'list':
			return { type: 'list', items: [''] };
	}
}

interface BlockBuilderProps {
	blocks: ArticleBlock[];
	onChange: (blocks: ArticleBlock[]) => void;
}

export function BlockBuilder({ blocks, onChange }: BlockBuilderProps) {
	const updateBlock = (index: number, block: ArticleBlock) => {
		const next = [...blocks];
		next[index] = block;
		onChange(next);
	};

	const removeBlock = (index: number) => {
		onChange(blocks.filter((_, blockIndex) => blockIndex !== index));
	};

	const moveBlock = (index: number, direction: -1 | 1) => {
		const target = index + direction;
		if (target < 0 || target >= blocks.length) return;
		const next = [...blocks];
		[next[index], next[target]] = [next[target], next[index]];
		onChange(next);
	};

	const addBlock = (type: ArticleBlock['type']) => {
		onChange([...blocks, createEmptyBlock(type)]);
	};

	return (
		<div className='space-y-4'>
			{blocks.map((block, index) => (
				<div key={index} className='rounded-xl border border-panel-muted bg-panel p-4'>
					<div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
						<label className='text-sm text-text-secondary'>
							Block {index + 1}
							<select
								value={block.type}
								onChange={event => updateBlock(index, createEmptyBlock(event.target.value as ArticleBlock['type']))}
								className='ml-2 rounded-md bg-surface px-2 py-1 text-sm text-text-primary'>
								{BLOCK_TYPES.map(type => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
						</label>
						<div className='flex gap-2'>
							<button
								type='button'
								onClick={() => moveBlock(index, -1)}
								disabled={index === 0}
								className='text-sm text-accent disabled:opacity-40'>
								Up
							</button>
							<button
								type='button'
								onClick={() => moveBlock(index, 1)}
								disabled={index === blocks.length - 1}
								className='text-sm text-accent disabled:opacity-40'>
								Down
							</button>
							<button type='button' onClick={() => removeBlock(index)} className='text-sm text-red-400'>
								Remove
							</button>
						</div>
					</div>

					{block.type === 'paragraph' || block.type === 'heading' || block.type === 'link' ?
						<textarea
							value={block.content}
							onChange={event => updateBlock(index, { ...block, content: event.target.value })}
							rows={block.type === 'paragraph' ? 4 : 2}
							className={inputClassName}
							placeholder={block.type === 'link' ? 'https://…' : 'Content'}
						/>
					:	null}

					{block.type === 'code' ?
						<div className='space-y-2'>
							<input
								type='text'
								value={block.language}
								onChange={event => updateBlock(index, { ...block, language: event.target.value })}
								className={inputClassName}
								placeholder='Language (e.g. tsx, bash)'
							/>
							<textarea
								value={block.code}
								onChange={event => updateBlock(index, { ...block, code: event.target.value })}
								rows={6}
								className={`${inputClassName} font-mono`}
								placeholder='Code'
							/>
						</div>
					:	null}

					{block.type === 'list' ?
						<div className='space-y-2'>
							{block.items.map((item, itemIndex) => (
								<div key={itemIndex} className='flex gap-2'>
									<input
										type='text'
										value={item}
										onChange={event => {
											const items = [...block.items];
											items[itemIndex] = event.target.value;
											updateBlock(index, { ...block, items });
										}}
										className={inputClassName}
										placeholder={`Item ${itemIndex + 1}`}
									/>
									<button
										type='button'
										onClick={() => {
											const items = block.items.filter((_, i) => i !== itemIndex);
											updateBlock(index, { ...block, items: items.length ? items : [''] });
										}}
										className='text-sm text-red-400'>
										×
									</button>
								</div>
							))}
							<button
								type='button'
								onClick={() => updateBlock(index, { ...block, items: [...block.items, ''] })}
								className='text-sm text-accent'>
								+ Add item
							</button>
						</div>
					:	null}
				</div>
			))}

			<div className='flex flex-wrap gap-2'>
				{BLOCK_TYPES.map(type => (
					<button
						key={type}
						type='button'
						onClick={() => addBlock(type)}
						className='rounded-md bg-panel px-3 py-2 text-sm text-text-primary hover:bg-panel-muted'>
						+ {type}
					</button>
				))}
			</div>
		</div>
	);
}
