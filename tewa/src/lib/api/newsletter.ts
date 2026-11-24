import { apiFetch } from "@/lib/api-client";

export async function subscribeToNewsletter(email: string): Promise<string> {
  const res = await apiFetch<{ message: string }>("/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return res.message;
}
