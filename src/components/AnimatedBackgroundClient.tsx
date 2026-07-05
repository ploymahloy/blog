'use client';

import { useReducer } from 'react';

import { randomOrbPosition } from '@/lib/random-in-range-client';

interface OrbPosition {
	cx: number;
	cy: number;
}

interface AnimatedBackgroundClientProps {
	initialPosition: OrbPosition;
}

export function AnimatedBackgroundClient({ initialPosition }: AnimatedBackgroundClientProps) {
	const [position, rerollPosition] = useReducer(() => randomOrbPosition(), initialPosition);

	return (
		<div
			aria-hidden
			className='pointer-events-none fixed inset-0 -z-10 overflow-hidden [view-transition-name:none]'>
			<svg
				className='h-full w-full'
				preserveAspectRatio='xMidYMid slice'
				viewBox='0 0 100 100'
				xmlns='http://www.w3.org/2000/svg'>
				<rect width='100' height='100' fill='var(--color-surface)' />
				<g
					className='animate-bg-fade motion-reduce:animate-none [filter:blur(3vmin)]'
					onAnimationIteration={rerollPosition}>
					<circle cx={position.cx} cy={position.cy} r='16' fill='var(--color-accent)' />
				</g>
			</svg>
		</div>
	);
}
