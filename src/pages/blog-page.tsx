import { useMemo, useState } from "react";

import { CodeBlock } from "../components/code-block";
import { TagChip } from "../components/tag-chip";
import { posts } from "../data/posts";
import type { BlogPost } from "../types/content";

function sortByNewest(postA: BlogPost, postB: BlogPost) {
  return (
    new Date(postB.publishedAt).getTime() - new Date(postA.publishedAt).getTime()
  );
}

export function BlogPage() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const availableTags = useMemo(
    () => [...new Set(posts.flatMap((post) => post.tags))].sort(),
    [],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesTag = activeTag ? post.tags.includes(activeTag) : true;
        if (!matchesTag) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const searchableText = `${post.title} ${post.summary} ${post.tags.join(" ")}`.toLowerCase();
        return searchableText.includes(normalizedQuery);
      })
      .sort(sortByNewest);
  }, [activeTag, normalizedQuery]);

  const toggleTag = (tag: string) => {
    setActiveTag((currentTag) => (currentTag === tag ? null : tag));
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-sm uppercase tracking-wide text-accent">Engineering Blog</p>
      <h1 className="mt-2 text-3xl font-semibold text-text-primary sm:text-4xl">
        Posts
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-secondary">
        Practical notes about shipping software, scaling systems, and improving
        developer workflows.
      </p>

      <div className="mt-8 rounded-xl border border-panel-border bg-panel p-4">
        <label htmlFor="blog-search" className="mb-2 block text-sm text-text-secondary">
          Search by title, summary, or tag
        </label>
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. React, migrations, reliability"
          className="w-full rounded-lg border border-panel-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              isActive={activeTag === tag}
              onClick={toggleTag}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {filteredPosts.length === 0 ? (
          <p className="rounded-xl border border-panel-border bg-panel p-6 text-text-secondary">
            No posts matched your search.
          </p>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-panel-border bg-panel p-6 shadow-soft"
            >
              <header>
                <h2 className="text-2xl font-semibold text-text-primary">{post.title}</h2>
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
          ))
        )}
      </div>
    </section>
  );
}
