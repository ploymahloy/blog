import type { Metadata } from 'next';

import { SiteFooter } from '@/components/Footer';
import { SiteHeader } from '@/components/Header';

import './globals.css';

export const metadata: Metadata = {
	title: {
		default: 'Patrick Mahloy',
		template: '%s | Patrick Mahloy'
	},
	description: 'Software engineer portfolio and engineering blog.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className='flex min-h-screen flex-col bg-surface'>
				<SiteHeader />
				<main
					id='page-content'
					className='flex-1 [view-transition-name:page] motion-reduce:animate-none page-load:animate-page-enter page-load:fill-forwards'>
					{children}
				</main>
				<SiteFooter />
			</body>
		</html>
	);
}
