import { apiFetch } from "@/lib/api-client";
import {
  AdminFeatured,
  AdminFeaturedDetail,
  FeaturedPerson,
  FeaturedProfile,
} from "@/types/api";

export interface FeaturedPayload {
  name: string;
  titles: string[];
  social_url: string;
  images: File[];
}

export interface ProfileEdit {
  name: string;
  titles: string[];
  social_url: string;
  tagline: string;
  location: string;
  public_answers: number[];
}

// ---------- Public ----------

export async function getFeaturedPeople(): Promise<FeaturedPerson[]> {
  const res = await apiFetch<{ data: FeaturedPerson[] }>("/featured-people");
  return res.data;
}

export async function getFeaturedProfile(
  slug: string
): Promise<FeaturedProfile> {
  const res = await apiFetch<{ data: FeaturedProfile }>(
    `/featured-people/${slug}`
  );
  return res.data;
}

// ---------- Admin ----------

export async function adminListFeatured(
  token: string
): Promise<AdminFeatured[]> {
  const res = await apiFetch<{ data: AdminFeatured[] }>(
    "/admin/featured-people",
    { token }
  );
  return res.data;
}

export async function adminGetFeatured(
  token: string,
  id: number
): Promise<AdminFeaturedDetail> {
  const res = await apiFetch<{ data: AdminFeaturedDetail }>(
    `/admin/featured-people/${id}`,
    { token }
  );
  return res.data;
}

export async function adminCreateFeatured(
  token: string,
  payload: FeaturedPayload
): Promise<FeaturedPerson> {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("social_url", payload.social_url);
  payload.titles.forEach((t) => formData.append("titles[]", t));
  payload.images.forEach((f) => formData.append("images[]", f));

  const res = await apiFetch<{ data: FeaturedPerson }>(
    "/admin/featured-people",
    { method: "POST", token, body: formData }
  );
  return res.data;
}

export async function adminCreateInvitation(
  token: string,
  payload: { name: string; email?: string }
): Promise<AdminFeatured> {
  const formData = new FormData();
  formData.append("name", payload.name);
  if (payload.email) formData.append("email", payload.email);

  const res = await apiFetch<{ data: AdminFeatured }>(
    "/admin/featured-invitations",
    { method: "POST", token, body: formData }
  );
  return res.data;
}

export async function adminSaveProfile(
  token: string,
  id: number,
  p: ProfileEdit
): Promise<AdminFeaturedDetail> {
  const fd = new FormData();
  fd.append("name", p.name);
  p.titles.forEach((t) => fd.append("titles[]", t));
  if (p.social_url) fd.append("social_url", p.social_url);
  if (p.tagline) fd.append("tagline", p.tagline);
  if (p.location) fd.append("location", p.location);
  p.public_answers.forEach((n) => fd.append("public_answers[]", String(n)));

  const res = await apiFetch<{ data: AdminFeaturedDetail }>(
    `/admin/featured-people/${id}/profile`,
    { method: "POST", token, body: fd }
  );
  return res.data;
}

export async function adminApprove(
  token: string,
  id: number
): Promise<AdminFeaturedDetail> {
  const res = await apiFetch<{ data: AdminFeaturedDetail }>(
    `/admin/featured-people/${id}/approve`,
    { method: "POST", token }
  );
  return res.data;
}

export async function adminRequestChanges(
  token: string,
  id: number,
  note: string
): Promise<AdminFeaturedDetail> {
  const fd = new FormData();
  fd.append("note", note);

  const res = await apiFetch<{ data: AdminFeaturedDetail }>(
    `/admin/featured-people/${id}/request-changes`,
    { method: "POST", token, body: fd }
  );
  return res.data;
}

export async function adminDeleteFeatured(
  token: string,
  id: number
): Promise<void> {
  await apiFetch<{ message: string }>(`/admin/featured-people/${id}`, {
    method: "DELETE",
    token,
  });
}
