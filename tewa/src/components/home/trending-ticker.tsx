import Link from "next/link";
import { Post } from "@/types/post";

export default function TrendingTicker({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  // ~8s per headline keeps the reading speed comfortable
  const duration = `${Math.max(posts.length * 8, 20)}s`;

  const renderGroup = (hidden: boolean) => (
    <div
      className="ticker-group flex min-w-full shrink-0 items-center"
      style={{ animationDuration: duration }}
      aria-hidden={hidden}
    >
      {posts.map((post) => (
        <div key={post.id} className="flex shrink-0 items-center">
          <Link
            href={`/post/${post.slug}`}
            tabIndex={hidden ? -1 : undefined}
            className="whitespace-nowrap font-medium text-tewa-black transition-colors hover:text-purple"
          >
            {post.title}
          </Link>
          <span className="mx-6 text-purple" aria-hidden="true">
            ●
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex items-center border-b border-tewa-black/10 py-4">
      <span className="relative z-10 flex shrink-0 items-center gap-2 bg-purple px-4 py-2 text-xs font-semibold tracking-wider text-white">
        ⚡ TRENDING
      </span>

      <div className="ticker relative ml-4 flex flex-1 overflow-hidden">
        {renderGroup(false)}
        {renderGroup(true)}
      </div>
    </div>
  );
}
