import { AnimatedBackgroundClient } from '@/components/AnimatedBackgroundClient';
import { randomOrbPosition } from '@/lib/random-in-range-server';

export function AnimatedBackground() {
	return <AnimatedBackgroundClient initialPosition={randomOrbPosition()} />;
}
