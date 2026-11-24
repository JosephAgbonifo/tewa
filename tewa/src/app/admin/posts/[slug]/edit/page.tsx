"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/lib/auth-context";
import { adminGetPost } from "@/lib/api/admin-posts";
import { ApiPost } from "@/types/api";
import PostForm from "@/components/admin/post-form";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { token } = useAuth();
  const [post, setPost] = useState<ApiPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    adminGetPost(token, slug)
      .then(setPost)
      .finally(() => setLoading(false));
  }, [token, slug]);

  if (loading) return <p className="text-sm text-text-dark/50">Loading…</p>;
  if (!post) return <p className="text-sm text-red-600">Post not found.</p>;

  return (
    <div>
      <h1 className="font-playfair text-2xl font-bold text-tewa-black">
        Edit Post
      </h1>
      <div className="mt-8">
        <PostForm initialPost={post} />
      </div>
    </div>
  );
}
