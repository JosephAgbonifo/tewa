import { apiFetch } from "@/lib/api-client";
import { ApiPost, ApiCategory, PaginatedResponse } from "@/types/api";
import { Post } from "@/types/post";

interface ResourceCollectionResponse<T> {
  data: T[];
}

function adaptPost(apiPost: ApiPost): Post {
  return {
    id: String(apiPost.id),
    slug: apiPost.slug,
    title: apiPost.title,
    excerpt: apiPost.excerpt ?? undefined,
    content: apiPost.body ? [apiPost.body] : undefined,
    image: apiPost.image ?? "/images/posts/placeholder.jpg",
    category: apiPost.category?.name ?? "Uncategorized",
    author: apiPost.author ?? "Tewa Staff",
    date: apiPost.published_at ?? new Date().toISOString(),
    trending: apiPost.is_trending,
    featured: apiPost.is_featured,
    top: apiPost.is_top,
  };
}

export async function getLatestPosts(limit = 8): Promise<Post[]> {
  const res = await apiFetch<ResourceCollectionResponse<ApiPost>>(
    `/posts/latest?limit=${limit}`
  );
  return res.data.map(adaptPost);
}

export async function getPopularPosts(limit = 3): Promise<Post[]> {
  const res = await apiFetch<ResourceCollectionResponse<ApiPost>>(
    `/posts/popular?limit=${limit}`
  );
  return res.data.map(adaptPost);
}

export async function getTrendingPosts(limit = 5): Promise<Post[]> {
  const res = await apiFetch<ResourceCollectionResponse<ApiPost>>(
    `/posts/trending?limit=${limit}`
  );
  return res.data.map(adaptPost);
}

export async function getTopPosts(limit = 5): Promise<Post[]> {
  const res = await apiFetch<ResourceCollectionResponse<ApiPost>>(
    `/posts/top?limit=${limit}`
  );
  return res.data.map(adaptPost);
}

export async function getFeaturedPosts(limit = 5): Promise<Post[]> {
  const res = await apiFetch<ResourceCollectionResponse<ApiPost>>(
    `/posts/featured?limit=${limit}`
  );
  return res.data.map(adaptPost);
}

export async function getPostsByCategory(
  categorySlug: string,
  perPage = 9,
  page = 1
): Promise<{ posts: Post[]; meta: PaginatedResponse<ApiPost>["meta"] | null }> {
  if (categorySlug === "popular") {
    const posts = await getPopularPosts(perPage);
    return { posts, meta: null };
  }

  const res = await apiFetch<PaginatedResponse<ApiPost>>(
    `/categories/${categorySlug}/posts?per_page=${perPage}&page=${page}`
  );
  return { posts: res.data.map(adaptPost), meta: res.meta };
}

export async function getTopPostByCategory(
  categorySlug: string
): Promise<Post | null> {
  try {
    const res = await apiFetch<{ data: ApiPost }>(
      `/categories/${categorySlug}/top`
    );
    return adaptPost(res.data);
  } catch {
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await apiFetch<{ data: ApiPost }>(`/posts/${slug}`);
    return adaptPost(res.data);
  } catch {
    return null;
  }
}

export async function getAllPosts(page = 1, perPage = 12) {
  const res = await apiFetch<PaginatedResponse<ApiPost>>(
    `/posts?page=${page}&per_page=${perPage}`
  );
  return {
    posts: res.data.map(adaptPost),
    meta: res.meta,
  };
}

export async function getCategories(): Promise<ApiCategory[]> {
  const res = await apiFetch<ResourceCollectionResponse<ApiCategory>>(
    "/categories"
  );
  return res.data;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const { posts } = await getAllPosts(1, 100);
  return posts.map((p) => p.slug);
}
