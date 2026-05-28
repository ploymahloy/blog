import { useEffect } from 'react';

export function useContentLoader(load: () => Promise<void>) {
	useEffect(() => {
		let cancelled = false;

		const run = async () => await load();

		queueMicrotask(() => {
			if (!cancelled) {
				void run();
			}
		});

		return () => {
			cancelled = true;
		};
	}, [load]);
}
