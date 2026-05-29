'use client';

import { AuthProvider } from '@/context/AuthProvider';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
	return <AuthProvider>{children}</AuthProvider>;
}
