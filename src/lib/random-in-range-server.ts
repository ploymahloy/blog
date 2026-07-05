import { getRandomInt } from 'trng-crypto';

function randomInRange(min: number, max: number): number {
	const range = max - min + 1;
	const threshold = Math.floor(1000 / range) * range;
	let value: number;

	do {
		value =
			Number(getRandomInt(1)) * 100 + Number(getRandomInt(1)) * 10 + Number(getRandomInt(1));
	} while (value >= threshold);

	return min + (value % range);
}

export function randomOrbPosition(): { cx: number; cy: number } {
	return {
		cx: randomInRange(10, 90),
		cy: randomInRange(10, 90)
	};
}
