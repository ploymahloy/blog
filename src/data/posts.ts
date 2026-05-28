import type { BlogPost } from "../types/content";

export const posts: BlogPost[] = [
  {
    id: "designing-resilient-job-workers",
    title: "Designing Resilient Job Workers in Node.js",
    summary:
      "How to keep background workers reliable when retries, idempotency, and observability all matter.",
    publishedAt: "2026-04-19",
    readTime: "6 min read",
    tags: ["Node.js", "Reliability", "Backend", "Queues"],
    content: [
      {
        type: "paragraph",
        content:
          "A worker that retries without safeguards can make an outage worse. The foundation is idempotency + bounded retries + good telemetry.",
      },
      {
        type: "heading",
        content: "Idempotency first",
      },
      {
        type: "paragraph",
        content:
          "Persist an idempotency key before processing so duplicate deliveries become safe no-ops.",
      },
      {
        type: "code",
        language: "ts",
        code: `export async function processPayment(job: PaymentJob): Promise<void> {
  const wasHandled = await idempotencyStore.exists(job.idempotencyKey);
  if (wasHandled) return;

  await idempotencyStore.begin(job.idempotencyKey);
  try {
    await payments.charge(job.payload);
    await idempotencyStore.complete(job.idempotencyKey);
  } catch (error) {
    await idempotencyStore.fail(job.idempotencyKey, String(error));
    throw error;
  }
}`,
      },
      {
        type: "list",
        items: [
          "Use exponential backoff and max attempts.",
          "Move poison jobs to a dead-letter queue.",
          "Tag logs/metrics with queue, worker, and retry count.",
        ],
      },
    ],
  },
  {
    id: "practical-react-rendering-choices",
    title: "Practical React Rendering Choices",
    summary:
      "A framework for deciding between server rendering, client rendering, and static pages in product teams.",
    publishedAt: "2026-03-01",
    readTime: "5 min read",
    tags: ["React", "Frontend", "Performance", "Architecture"],
    content: [
      {
        type: "paragraph",
        content:
          "Rendering is a product decision before it is a framework decision. Start with user-perceived latency and interaction needs.",
      },
      {
        type: "heading",
        content: "Decision matrix",
      },
      {
        type: "code",
        language: "tsx",
        code: `type RenderMode = "server" | "client" | "static";

export function chooseRenderMode(args: {
  isPersonalized: boolean;
  needsRealtimeInteraction: boolean;
  updateFrequency: "low" | "medium" | "high";
}): RenderMode {
  if (args.needsRealtimeInteraction) return "client";
  if (args.isPersonalized || args.updateFrequency === "high") return "server";
  return "static";
}`,
      },
      {
        type: "paragraph",
        content:
          "The win is consistency: teams stop arguing from preference and decide from constraints.",
      },
    ],
  },
  {
    id: "shipping-safe-database-migrations",
    title: "Shipping Safe Database Migrations",
    summary:
      "A zero-downtime migration flow that scales from small teams to high-traffic production systems.",
    publishedAt: "2026-01-14",
    readTime: "7 min read",
    tags: ["Databases", "DevOps", "PostgreSQL", "Migrations"],
    content: [
      {
        type: "paragraph",
        content:
          "Most migration incidents come from tight coupling between schema and app deploy timing. Expand-contract removes that risk.",
      },
      {
        type: "heading",
        content: "Expand then contract",
      },
      {
        type: "code",
        language: "sql",
        code: `-- expand
ALTER TABLE invoices ADD COLUMN external_reference text;

-- backfill in batches
UPDATE invoices
SET external_reference = concat('inv_', id)
WHERE external_reference IS NULL
LIMIT 1000;

-- contract (after all services stop reading old field)
ALTER TABLE invoices DROP COLUMN legacy_reference;`,
      },
      {
        type: "list",
        items: [
          "Make every step forward-compatible.",
          "Backfill in bounded batches with progress metrics.",
          "Run contract cleanup only after telemetry confirms safety.",
        ],
      },
    ],
  },
];
