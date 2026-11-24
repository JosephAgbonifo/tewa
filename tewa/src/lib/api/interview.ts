import { apiFetch } from "@/lib/api-client";
import { InterviewData, InterviewSignoff } from "@/types/api";

export interface DraftPayload {
  answers: Record<number, string>;
  signoff: InterviewSignoff;
  photo_credit: string;
}

function buildDraft(p: DraftPayload): FormData {
  const fd = new FormData();
  Object.entries(p.answers).forEach(([n, v]) => {
    if (v.trim()) fd.append(`answers[${n}]`, v);
  });
  (["full_name", "title_org", "signature", "contact"] as const).forEach((k) => {
    const v = p.signoff[k];
    if (v) fd.append(`signoff[${k}]`, v);
  });
  (p.signoff.consents ?? []).forEach((c, i) =>
    fd.append(`signoff[consents][${i}]`, c ? "1" : "0")
  );
  if (p.photo_credit) fd.append("photo_credit", p.photo_credit);
  return fd;
}

export async function getInterview(token: string): Promise<InterviewData> {
  const res = await apiFetch<{ data: InterviewData }>(`/interview/${token}`);
  return res.data;
}

export async function saveInterviewDraft(
  token: string,
  payload: DraftPayload
): Promise<void> {
  await apiFetch(`/interview/${token}/draft`, {
    method: "POST",
    body: buildDraft(payload),
  });
}

export async function uploadInterviewPhoto(
  token: string,
  file: File
): Promise<string[]> {
  const fd = new FormData();
  fd.append("photo", file);
  const res = await apiFetch<{ data: { images: string[] } }>(
    `/interview/${token}/photos`,
    { method: "POST", body: fd }
  );
  return res.data.images;
}

export async function deleteInterviewPhoto(
  token: string,
  index: number
): Promise<string[]> {
  const res = await apiFetch<{ data: { images: string[] } }>(
    `/interview/${token}/photos/${index}`,
    { method: "DELETE" }
  );
  return res.data.images;
}

export async function submitInterview(token: string): Promise<void> {
  await apiFetch(`/interview/${token}/submit`, { method: "POST" });
}

export async function confirmPreview(token: string): Promise<void> {
  await apiFetch(`/interview/${token}/confirm`, { method: "POST" });
}

export async function requestProfileChanges(
  token: string,
  note: string
): Promise<void> {
  const fd = new FormData();
  fd.append("note", note);
  await apiFetch(`/interview/${token}/request-changes`, {
    method: "POST",
    body: fd,
  });
}
