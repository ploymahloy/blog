interface TagChipProps {
	tag: string;
	isActive?: boolean;
	onClick?: (tag: string) => void;
}

export function TagChip({ tag, isActive = false, onClick }: TagChipProps) {
	const sharedClassName = 'rounded-full px-3 py-1 text-xs font-medium transition-colors';

	if (!onClick) {
		return <span className={`${sharedClassName} bg-panel-muted text-text-secondary`}>{tag}</span>;
	}

	return (
		<button
			type='button'
			onClick={() => onClick(tag)}
			className={`${sharedClassName} cursor-pointer ${
				isActive ? 'bg-accent/20 text-accent' : (
					'bg-panel-muted text-text-secondary hover:bg-panel hover:text-text-primary'
				)
			}`}>
			{tag}
		</button>
	);
}
