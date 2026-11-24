"use client";

import { useEffect, useState } from "react";
import { categories } from "@/lib/mock-posts";
import { getPostsByCategory } from "@/lib/api/posts";
import { Post } from "@/types/post";
import PostCardVertical from "@/components/post/post-card-vertical";

export default function LatestNews() {
  const [active, setActive] = useState<(typeof categories)[number]>("Popular");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const slug = active.toLowerCase();

    getPostsByCategory(slug, 3)
      .then((res) => {
        if (!cancelled) setPosts(res.posts);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <section className="py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-tewa-black/10 pb-4">
        <h2 className="font-playfair text-xl font-bold tracking-wide text-tewa-black">
          ALL THE LATEST NEWS
        </h2>
        <div className="flex flex-wrap gap-6 text-sm font-semibold tracking-wide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`pb-1 uppercase transition-colors ${
                active === cat
                  ? "text-purple border-b-2 border-gold"
                  : "text-text-dark/50 hover:text-purple"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {loading ? (
          <p className="col-span-3 text-sm text-text-dark/50">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="col-span-3 text-sm text-text-dark/50">
            No posts in this category yet.
          </p>
        ) : (
          posts.map((post) => <PostCardVertical post={post} key={post.id} />)
        )}
      </div>
    </section>
  );
}
