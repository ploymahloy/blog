import { Link, Navigate, useParams } from "react-router-dom";

import { CodeBlock } from "../components/code-block";
import { TagChip } from "../components/tag-chip";
import { posts } from "../data/posts";

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Link
        to="/blog"
        className="text-sm text-accent transition-colors hover:text-accent-soft"
      >
        Back to blog
      </Link>

      <article className="mt-6 rounded-xl bg-panel p-6 shadow-soft">
        <header>
          <h1 className="text-3xl font-semibold text-text-primary">{post.title}</h1>
          <p className="mt-2 text-sm text-text-muted">
            {new Date(post.publishedAt).toLocaleDateString()} · {post.readTime}
          </p>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            {post.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagChip key={`${post.id}-${tag}`} tag={tag} />
            ))}
          </div>
        </header>

        <div className="mt-6 space-y-4">
          {post.content.map((block, index) => {
            if (block.type === "paragraph") {
              return (
                <p
                  key={`${post.id}-paragraph-${index}`}
                  className="leading-relaxed text-text-secondary"
                >
                  {block.content}
                </p>
              );
            }

            if (block.type === "heading") {
              return (
                <h3
                  key={`${post.id}-heading-${index}`}
                  className="text-lg font-semibold text-text-primary"
                >
                  {block.content}
                </h3>
              );
            }

            if (block.type === "list") {
              return (
                <ul
                  key={`${post.id}-list-${index}`}
                  className="list-disc space-y-2 pl-6 text-text-secondary"
                >
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }

            return (
              <CodeBlock
                key={`${post.id}-code-${index}`}
                code={block.code}
                language={block.language}
              />
            );
          })}
        </div>
      </article>
    </section>
  );
}
