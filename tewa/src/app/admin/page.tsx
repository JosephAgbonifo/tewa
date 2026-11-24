"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { adminListPosts, adminDeletePost } from "@/lib/api/admin-posts";
import { ApiPost } from "@/types/api";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadPosts = () => {
    if (!token) return;
    setLoading(true);
    adminListPosts(token)
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(loadPosts, [token]);

  const handleDelete = async (post: ApiPost) => {
    if (!token) return;
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;

    setDeletingId(post.id);
    try {
      await adminDeletePost(token, post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch {
      alert("Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-tewa-black">
            Posts
          </h1>
          <p className="mt-1 text-sm text-text-dark/60">
            {posts.length} post{posts.length !== 1 ? "s" : ""} published
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-purple px-6 py-2.5 text-sm font-semibold text-white hover:bg-gold hover:text-tewa-black transition-colors"
        >
          + NEW POST
        </Link>
      </div>

      <div className="mt-8 flex flex-col divide-y divide-tewa-black/10 border-y border-tewa-black/10">
        {loading ? (
          <p className="py-6 text-sm text-text-dark/50">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="py-6 text-sm text-text-dark/50">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 py-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-cream">
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1">
                <p className="font-semibold text-tewa-black">{post.title}</p>
                <p className="mt-1 text-xs text-text-dark/50">
                  {post.category?.name ?? "Uncategorized"} &middot;{" "}
                  {post.views_count} views
                  {post.is_top && (
                    <span className="ml-2 bg-gold/20 px-2 py-0.5 text-gold">
                      TOP
                    </span>
                  )}
                  {post.is_trending && (
                    <span className="ml-2 bg-purple/10 px-2 py-0.5 text-purple">
                      TRENDING
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-4 text-sm font-semibold">
                <Link
                  href={`/admin/posts/${post.slug}/edit`}
                  className="text-purple hover:text-gold transition-colors"
                >
                  EDIT
                </Link>
                <button
                  onClick={() => handleDelete(post)}
                  disabled={deletingId === post.id}
                  className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                >
                  {deletingId === post.id ? "DELETING…" : "DELETE"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
