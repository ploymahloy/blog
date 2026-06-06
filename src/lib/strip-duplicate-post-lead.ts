function normalizeText(text: string): string {
	return text.trim().toLowerCase();
}

function matchesText(a: string, b: string): boolean {
	return normalizeText(a) === normalizeText(b);
}

function splitBlocks(markdown: string): string[][] {
	const blocks: string[][] = [];
	let current: string[] = [];

	for (const line of markdown.split('\n')) {
		if (line.trim() === '') {
			if (current.length > 0) {
				blocks.push(current);
				current = [];
			}
			continue;
		}

		current.push(line);
	}

	if (current.length > 0) {
		blocks.push(current);
	}

	return blocks;
}

function blockText(block: string[]): string {
	return block.join('\n').trim();
}

function isTitleBlock(block: string[], title: string): boolean {
	if (block.length !== 1) {
		return false;
	}

	const match = block[0].match(/^#\s+(.+)$/);
	return match !== null && matchesText(match[1], title);
}

function isSummaryBlock(block: string[], summary: string): boolean {
	return summary.trim() !== '' && matchesText(blockText(block), summary);
}

export function stripDuplicatePostLead(markdown: string, title: string, summary: string): string {
	const blocks = splitBlocks(markdown.replace(/^\uFEFF/, ''));
	let start = 0;

	if (start < blocks.length && isTitleBlock(blocks[start], title)) {
		start++;
	}

	if (start < blocks.length && isSummaryBlock(blocks[start], summary)) {
		start++;
	}

	return blocks
		.slice(start)
		.map(blockText)
		.join('\n\n')
		.trimStart();
}
