import { apiFetch } from "@/lib/api-client";
import { ApiCategory } from "@/types/api";

export async function adminListCategories(): Promise<ApiCategory[]> {
  const res = await apiFetch<{ data: ApiCategory[] }>("/categories");
  return res.data;
}

export async function adminCreateCategory(
  token: string,
  name: string
): Promise<ApiCategory> {
  const res = await apiFetch<{ data: ApiCategory }>("/admin/categories", {
    method: "POST",
    token,
    body: JSON.stringify({ name }),
  });
  return res.data;
}

export async function adminUpdateCategory(
  token: string,
  categoryId: number,
  name: string
): Promise<ApiCategory> {
  const res = await apiFetch<{ data: ApiCategory }>(
    `/admin/categories/${categoryId}`,
    {
      method: "PUT",
      token,
      body: JSON.stringify({ name }),
    }
  );
  return res.data;
}

export async function adminDeleteCategory(
  token: string,
  categoryId: number
): Promise<void> {
  await apiFetch<{ message: string }>(`/admin/categories/${categoryId}`, {
    method: "DELETE",
    token,
  });
}
