"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { adminSendNewsletter } from "@/lib/api/admin-newsletter";
import RichTextEditor from "@/components/admin/rich-text-editor";

export default function NewsletterPage() {
  const { token } = useAuth();
  const [subject, setSubject] = useState("");
  const [htmlBody, setHtmlBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (
      !confirm("This will send an email to every active subscriber. Continue?")
    ) {
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const res = await adminSendNewsletter(token, subject, htmlBody);
      setResult({
        type: "success",
        message: `Sent to ${res.campaign.recipients_count} subscribers.`,
      });
      setSubject("");
      setHtmlBody("");
    } catch {
      setResult({ type: "error", message: "Failed to send newsletter." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-playfair text-2xl font-bold text-tewa-black">
        Send Newsletter
      </h1>
      <p className="mt-1 text-sm text-text-dark/60">
        Compose a rich HTML email and send it to every active subscriber.
      </p>

      <form onSubmit={handleSend} className="mt-8 flex flex-col gap-6">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-dark/60">
            Subject
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-tewa-black/15 px-4 py-2.5 text-sm outline-none focus:border-purple"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-dark/60">
            Body
          </label>
          <RichTextEditor value={htmlBody} onChange={setHtmlBody} />
        </div>

        {result && (
          <p
            className={`text-sm ${
              result.type === "success" ? "text-purple" : "text-red-600"
            }`}
          >
            {result.message}
          </p>
        )}

        <button
          type="submit"
          disabled={sending || !subject || !htmlBody}
          className="w-fit bg-purple px-8 py-3 text-sm font-semibold tracking-wider text-white hover:bg-gold hover:text-tewa-black transition-colors disabled:opacity-50"
        >
          {sending ? "SENDING…" : "SEND TO ALL SUBSCRIBERS"}
        </button>
      </form>
    </div>
  );
}
