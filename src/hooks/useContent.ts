import { useContext } from 'react';

import { ContentContext } from '../context/content-context';
import type { ContentContextValue } from '../context/content-types';

export function useContent(): ContentContextValue {
	const context = useContext(ContentContext);
	if (!context) {
		throw new Error('useContent must be used within ContentProvider');
	}
	return context;
}
