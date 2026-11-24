import { apiFetch } from "@/lib/api-client";
import { ApiPost, PaginatedResponse } from "@/types/api";

export interface PostPayload {
  title: string;
  excerpt?: string;
  body: string;
  category_id: number;
  is_top?: boolean;
  is_trending?: boolean;
  is_featured?: boolean;
  image?: File | null;
}

function buildFormData(payload: PostPayload): FormData {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("body", payload.body);
  formData.append("category_id", String(payload.category_id));
  if (payload.excerpt) formData.append("excerpt", payload.excerpt);
  if (payload.is_top !== undefined)
    formData.append("is_top", payload.is_top ? "1" : "0");
  if (payload.is_trending !== undefined)
    formData.append("is_trending", payload.is_trending ? "1" : "0");
  if (payload.is_featured !== undefined)
    formData.append("is_featured", payload.is_featured ? "1" : "0");
  if (payload.image) formData.append("image", payload.image);
  return formData;
}

export async function adminListPosts(
  token: string,
  page = 1
): Promise<PaginatedResponse<ApiPost>> {
  return apiFetch<PaginatedResponse<ApiPost>>(
    `/posts?page=${page}&per_page=20`,
    {
      token,
    }
  );
}

export async function adminGetPost(
  token: string,
  slug: string
): Promise<ApiPost> {
  const res = await apiFetch<{ data: ApiPost }>(`/posts/${slug}`, { token });
  return res.data;
}

export async function adminCreatePost(
  token: string,
  payload: PostPayload
): Promise<ApiPost> {
  const res = await apiFetch<{ data: ApiPost }>("/admin/posts", {
    method: "POST",
    token,
    body: buildFormData(payload),
  });
  return res.data;
}

export async function adminUpdatePost(
  token: string,
  postId: number,
  payload: PostPayload
): Promise<ApiPost> {
  const res = await apiFetch<{ data: ApiPost }>(`/admin/posts/${postId}`, {
    method: "POST",
    token,
    body: buildFormData(payload),
  });
  return res.data;
}

export async function adminDeletePost(
  token: string,
  postId: number
): Promise<void> {
  await apiFetch<{ message: string }>(`/admin/posts/${postId}`, {
    method: "DELETE",
    token,
  });
}
