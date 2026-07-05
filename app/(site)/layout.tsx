import { AnimatedBackground } from '@/components/AnimatedBackground';
import { SiteFooter } from '@/components/Footer';
import { SiteHeader } from '@/components/Header';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<AnimatedBackground />
			<SiteHeader />
			<main
				id='page-content'
				className='relative flex-1 [view-transition-name:page] motion-reduce:animate-none page-load:animate-page-enter page-load:fill-forwards'>
				{children}
			</main>
			<SiteFooter />
		</>
	);
}
