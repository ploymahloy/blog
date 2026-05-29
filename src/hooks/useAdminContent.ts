'use client';

import { useContext } from 'react';

import { AdminContentContext } from '@/context/admin-content-context';

export function useAdminContent() {
	const context = useContext(AdminContentContext);
	if (!context) {
		throw new Error('useAdminContent must be used within AdminContentProvider');
	}
	return context;
}
