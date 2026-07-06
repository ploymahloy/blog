'use client';

import { useEffect, useReducer } from 'react';

import { randomOrbPosition } from '@/lib/random-in-range-client';

const FADE_DURATION_MS = 15_000;

interface OrbPosition {
	cx: number;
	cy: number;
}

interface AnimatedBackgroundClientProps {
	initialPosition: OrbPosition;
}

export function AnimatedBackgroundClient({ initialPosition }: AnimatedBackgroundClientProps) {
	const [position, rerollPosition] = useReducer(() => randomOrbPosition(), initialPosition);

	useEffect(() => {
		const intervalId = window.setInterval(rerollPosition, FADE_DURATION_MS);
		return () => window.clearInterval(intervalId);
	}, []);

	return (
		<div
			aria-hidden
			className='pointer-events-none fixed inset-0 -z-10 overflow-hidden [view-transition-name:none]'>
			<svg
				className='h-full w-full'
				preserveAspectRatio='xMidYMid slice'
				viewBox='0 0 100 100'
				xmlns='http://www.w3.org/2000/svg'>
				<defs>
					<radialGradient id='orb-glow'>
						<stop offset='0%' stopColor='var(--color-accent)' stopOpacity='0.9' />
						<stop offset='45%' stopColor='var(--color-accent)' stopOpacity='0.35' />
						<stop offset='100%' stopColor='var(--color-accent)' stopOpacity='0' />
					</radialGradient>
					<filter id='orb-blur' x='-100%' y='-100%' width='300%' height='300%'>
						<feGaussianBlur stdDeviation='6' />
					</filter>
					<filter id='orb-blur-sm' x='-100%' y='-100%' width='300%' height='300%'>
						<feGaussianBlur stdDeviation='12' />
					</filter>
				</defs>
				<rect width='100' height='100' fill='var(--color-surface)' />
				<g className='animate-bg-fade motion-reduce:animate-none max-sm:hidden'>
					<circle
						cx={position.cx}
						cy={position.cy}
						r='22'
						fill='url(#orb-glow)'
						filter='url(#orb-blur)'
					/>
				</g>
				<g className='animate-bg-fade motion-reduce:animate-none hidden max-sm:block'>
					<circle
						cx={position.cx}
						cy={position.cy}
						r='28'
						fill='url(#orb-glow)'
						filter='url(#orb-blur-sm)'
					/>
				</g>
			</svg>
		</div>
	);
}
