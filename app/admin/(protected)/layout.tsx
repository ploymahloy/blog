'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminContentProvider } from '@/context/AdminContentProvider';

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
	return (
		<AdminContentProvider>
			<AdminGuard>{children}</AdminGuard>
		</AdminContentProvider>
	);
}
