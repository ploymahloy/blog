function randomInRange(min: number, max: number): number {
	const range = max - min + 1;
	const threshold = Math.floor(65536 / range) * range;
	const buffer = new Uint16Array(1);

	do {
		crypto.getRandomValues(buffer);
	} while (buffer[0] >= threshold);

	return min + (buffer[0] % range);
}

export function randomOrbPosition(): { cx: number; cy: number } {
	return {
		cx: randomInRange(10, 90),
		cy: randomInRange(10, 90)
	};
}
