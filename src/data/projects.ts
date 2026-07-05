import type { Project } from '@/types/content';

export const projects: Project[] = [
	{
		id: 'event-stream-observability',
		title: 'Event Stream Observability Platform',
		summary:
			'Built a distributed tracing dashboard that correlates Kafka events with service latency in real time.',
		stack: ['typescript', 'go', 'kafka', 'postgresql', 'opentelemetry'],
		repoUrl: 'https://github.com/example/event-stream-observability',
		liveUrl: 'https://demo.example.dev/observability'
	},
	{
		id: 'feature-flag-delivery',
		title: 'Feature Flag Delivery Engine',
		summary:
			'Created an edge-ready flag service with deterministic bucketing and low-latency SDK evaluation.',
		stack: ['typescript', 'nodejs', 'redis', 'react'],
		repoUrl: 'https://github.com/example/feature-flag-delivery',
		inProgress: true
	},
	{
		id: 'developer-notes-ai',
		title: 'Developer Notes Assistant',
		summary:
			'Designed a searchable engineering notebook that turns architecture notes into actionable runbooks.',
		stack: ['react', 'typescript', 'python', 'fastapi', 'sqlite'],
		repoUrl: 'https://github.com/example/developer-notes-ai',
		liveUrl: 'https://demo.example.dev/dev-notes'
	},
	{
		id: 'fitness-app',
		title: 'Fitness App',
		summary:
			'[🦀 Rust API Server + 🪶 SQLite Database] in a 🐳 Docker container self-hosted on a 🍌 Banana Pi!',
		stack: ['rust', 'sqlite', 'docker', 'raspberrypi'],
		repoUrl: 'https://github.com/example/fitness-app'
	}
];
