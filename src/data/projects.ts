import type { Project } from "../types/content";

export const projects: Project[] = [
  {
    id: "event-stream-observability",
    title: "Event Stream Observability Platform",
    summary:
      "Built a distributed tracing dashboard that correlates Kafka events with service latency in real time.",
    stack: ["TypeScript", "Go", "Kafka", "PostgreSQL", "OpenTelemetry"],
    repoUrl: "https://github.com/example/event-stream-observability",
    liveUrl: "https://demo.example.dev/observability",
    featuredReason:
      "Improved incident triage speed by visualizing producer-consumer lag and traces in one flow.",
  },
  {
    id: "feature-flag-delivery",
    title: "Feature Flag Delivery Engine",
    summary:
      "Created an edge-ready flag service with deterministic bucketing and low-latency SDK evaluation.",
    stack: ["TypeScript", "Node.js", "Redis", "React"],
    repoUrl: "https://github.com/example/feature-flag-delivery",
    featuredReason:
      "Reduced release risk by enabling safe rollouts with per-segment targeting and audit trails.",
  },
  {
    id: "developer-notes-ai",
    title: "Developer Notes Assistant",
    summary:
      "Designed a searchable engineering notebook that turns architecture notes into actionable runbooks.",
    stack: ["React", "TypeScript", "Python", "FastAPI", "SQLite"],
    repoUrl: "https://github.com/example/developer-notes-ai",
    liveUrl: "https://demo.example.dev/dev-notes",
    featuredReason:
      "Helped onboard new engineers faster by pairing historical decisions with code references.",
  },
];
