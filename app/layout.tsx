import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
	title: {
		default: 'Patrick Mahloy',
		template: '%s | Patrick Mahloy'
	},
	description: 'Software engineer portfolio and engineering blog.',
	icons: {
		icon: [
			{ url: '/favicon.ico', sizes: 'any' },
			{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
		],
		apple: '/apple-touch-icon.png'
	},
	manifest: '/site.webmanifest'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className='relative flex min-h-screen flex-col bg-surface'>{children}</body>
		</html>
	);
}
