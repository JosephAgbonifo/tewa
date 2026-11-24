"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { adminCreateInvitation } from "@/lib/api/featured";

const inputCls =
  "w-full border border-tewa-black/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple";

export default function InvitePage() {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError("");
    try {
      const created = await adminCreateInvitation(token, {
        name: name.trim(),
        email: email.trim() || undefined,
      });
      setLink(created.interview_url ?? "");
    } catch {
      setError(
        "Could not create the invitation. Check the fields and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const reset = () => {
    setName("");
    setEmail("");
    setLink("");
  };

  return (
    <div>
      <h1 className="font-playfair text-2xl font-bold text-tewa-black">
        Invite a person
      </h1>
      <p className="mt-1 text-sm text-text-dark/60">
        This creates a private interview link. Send it to them yourself; the
        link saves their progress and locks once they submit.
      </p>

      {link ? (
        <div className="mt-8 max-w-2xl">
          <p className="text-sm font-semibold text-tewa-black">
            Interview link for {name}
          </p>
          <div className="mt-2 flex gap-2">
            <input
              readOnly
              value={link}
              className={inputCls}
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={copy}
              className="shrink-0 bg-purple px-5 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-tewa-black"
            >
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>
          <div className="mt-6 flex gap-5 text-sm font-semibold">
            <button onClick={reset} className="text-purple hover:text-gold">
              INVITE ANOTHER
            </button>
            <Link
              href="/admin/featured"
              className="text-tewa-black/60 hover:text-tewa-black"
            >
              BACK TO LIST
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex max-w-xl flex-col gap-5"
        >
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">
              Email (optional, for your records)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-fit bg-purple px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-tewa-black disabled:opacity-50"
          >
            {submitting ? "CREATING…" : "CREATE INVITATION"}
          </button>
        </form>
      )}
    </div>
  );
}
