import { apiFetch } from "@/lib/api-client";

interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
}

interface SendNewsletterResponse {
  message: string;
  campaign: {
    id: number;
    subject: string;
    recipients_count: number;
    sent_at: string;
  };
}

export async function adminListSubscribers(
  token: string,
  page = 1
): Promise<{ data: Subscriber[]; total: number }> {
  const res = await apiFetch<{ data: Subscriber[]; total: number }>(
    `/admin/newsletter/subscribers?page=${page}`,
    { token }
  );
  return res;
}

export async function adminSendNewsletter(
  token: string,
  subject: string,
  htmlBody: string
): Promise<SendNewsletterResponse> {
  return apiFetch<SendNewsletterResponse>("/admin/newsletter/send", {
    method: "POST",
    token,
    body: JSON.stringify({ subject, html_body: htmlBody }),
  });
}
