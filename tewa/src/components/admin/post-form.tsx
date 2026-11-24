"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { adminListCategories } from "@/lib/api/admin-categories";
import {
  adminCreatePost,
  adminUpdatePost,
  PostPayload,
} from "@/lib/api/admin-posts";
import { ApiCategory, ApiPost } from "@/types/api";
import RichTextEditor from "@/components/admin/rich-text-editor";

interface PostFormProps {
  initialPost?: ApiPost;
}

export default function PostForm({ initialPost }: PostFormProps) {
  const { token } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [body, setBody] = useState(initialPost?.body ?? "");
  const [categoryId, setCategoryId] = useState<number | "">(
    initialPost?.category?.id ?? ""
  );
  const [isTop, setIsTop] = useState(initialPost?.is_top ?? false);
  const [isTrending, setIsTrending] = useState(
    initialPost?.is_trending ?? false
  );
  const [isFeatured, setIsFeatured] = useState(
    initialPost?.is_featured ?? false
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialPost?.image ?? null
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminListCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    setSubmitting(true);
    setError("");

    const payload: PostPayload = {
      title,
      excerpt: excerpt || undefined,
      body,
      category_id: categoryId,
      is_top: isTop,
      is_trending: isTrending,
      is_featured: isFeatured,
      image: imageFile,
    };

    try {
      if (initialPost) {
        await adminUpdatePost(token, initialPost.id, payload);
      } else {
        await adminCreatePost(token, payload);
      }
      router.push("/admin");
    } catch {
      setError("Failed to save post. Check the required fields and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-6">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-dark/60">
          Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-tewa-black/15 px-4 py-2.5 text-sm outline-none focus:border-purple"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-dark/60">
          Excerpt (optional)
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full border border-tewa-black/15 px-4 py-2.5 text-sm outline-none focus:border-purple"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-dark/60">
            Category
          </label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="w-full border border-tewa-black/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-dark/60">
            Featured Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm file:mr-4 file:border-0 file:bg-purple file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gold hover:file:text-tewa-black"
          />
        </div>
      </div>

      {imagePreview && (
        <div className="relative h-48 w-full max-w-sm overflow-hidden border border-tewa-black/10">
          <Image
            src={imagePreview}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-8">
        <label className="flex items-center gap-2 text-sm text-text-dark">
          <input
            type="checkbox"
            checked={isTop}
            onChange={(e) => setIsTop(e.target.checked)}
            className="h-4 w-4 accent-purple"
          />
          Top News (hero carousel)
        </label>
        <label className="flex items-center gap-2 text-sm text-text-dark">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 accent-purple"
          />
          Featured (homepage grid)
        </label>
        <label className="flex items-center gap-2 text-sm text-text-dark">
          <input
            type="checkbox"
            checked={isTrending}
            onChange={(e) => setIsTrending(e.target.checked)}
            className="h-4 w-4 accent-purple"
          />
          Trending
        </label>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-dark/60">
          Body
        </label>
        <RichTextEditor value={body} onChange={setBody} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bg-purple px-8 py-3 text-sm font-semibold tracking-wider text-white hover:bg-gold hover:text-tewa-black transition-colors disabled:opacity-50"
        >
          {submitting
            ? "SAVING…"
            : initialPost
            ? "UPDATE POST"
            : "PUBLISH POST"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-8 py-3 text-sm font-semibold text-text-dark/60 hover:text-tewa-black transition-colors"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}
