import type { BlogPost } from '../types/content';

export const posts: BlogPost[] = [
	{
		id: 'designing-resilient-job-workers',
		title: 'Spinning Up Your First EC2 Instance',
		summary: 'How to spin up your first EC2 instance and get it running.',
		publishedAt: '2026-05-28',
		readTime: '6 min read',
		tags: ['AWS', 'EC2', 'Linux', 'SSH'],
		content: `So you want to host your API server on AWS? Follow along as I walk you through the process of spinning up your first EC2 instance.

### Brace yourself

Nothing is intuitive in AWS, and the provided instructions/docs aren't exactly helpful. There are a lof of steps and you will need to pay attention to every detail. I will be launching an Amazon Linux EC2 instance. Reference steps 1 and 2 below:

https://aws.amazon.com/ec2/getting-started/

Step 3 implies that you can optionally add a security group to the instance, but make no mistake: you MUST add a security group in order to SSH into the instance. See details below:

\`\`\`bash
ec2 instance security group deets
\`\`\`

### SSH into the instance

In order to SSH into the instance, you will need a \`.pem\` file. This file is used to authenticate your SSH connection to the instance. You can create a new \`.pem\` file by going to Page > Link > Here > There

\`\`\`bash
ssh -i ~/.ssh/your-key.pem ec2-user@your-instance-public-ip
\`\`\``
	},
	{
		id: 'practical-react-rendering-choices',
		title: 'Practical React Rendering Choices',
		summary: 'A framework for deciding between server rendering, client rendering, and static pages in product teams.',
		publishedAt: '2026-03-01',
		readTime: '5 min read',
		tags: ['React', 'Frontend', 'Performance', 'Architecture'],
		content: `Rendering is a product decision before it is a framework decision. Start with user-perceived latency and interaction needs.

### Decision matrix

\`\`\`tsx
type RenderMode = "server" | "client" | "static";

export function chooseRenderMode(args: {
  isPersonalized: boolean;
  needsRealtimeInteraction: boolean;
  updateFrequency: "low" | "medium" | "high";
}): RenderMode {
  if (args.needsRealtimeInteraction) return "client";
  if (args.isPersonalized || args.updateFrequency === "high") return "server";
  return "static";
}
\`\`\`

The win is consistency: teams stop arguing from preference and decide from constraints.`
	},
	{
		id: 'shipping-safe-database-migrations',
		title: 'Shipping Safe Database Migrations',
		summary: 'A zero-downtime migration flow that scales from small teams to high-traffic production systems.',
		publishedAt: '2026-01-14',
		readTime: '7 min read',
		tags: ['Databases', 'DevOps', 'PostgreSQL', 'Migrations'],
		content: `Most migration incidents come from tight coupling between schema and app deploy timing. Expand-contract removes that risk.

### Expand then contract

\`\`\`sql
-- expand
ALTER TABLE invoices ADD COLUMN external_reference text;

-- backfill in batches
UPDATE invoices
SET external_reference = concat('inv_', id)
WHERE external_reference IS NULL
LIMIT 1000;

-- contract (after all services stop reading old field)
ALTER TABLE invoices DROP COLUMN legacy_reference;
\`\`\`

- Make every step forward-compatible.
- Backfill in bounded batches with progress metrics.
- Run contract cleanup only after telemetry confirms safety.`
	}
];
