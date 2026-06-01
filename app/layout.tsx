import type { Metadata } from 'next';

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
			<body className='min-h-screen bg-surface'>
				<SiteHeader />
				<main
					id='page-content'
					className='[view-transition-name:page] motion-reduce:animate-none page-load:animate-page-enter page-load:fill-forwards'>
					{children}
				</main>
			</body>
		</html>
	);
}
