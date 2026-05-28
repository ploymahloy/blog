import { createContext } from 'react';

import type { ContentContextValue } from './content-types.ts';

export const ContentContext = createContext<ContentContextValue | null>(null);
