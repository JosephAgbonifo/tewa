"use client";

import { useState } from "react";
import ProfileView from "@/components/featured/profile-view";
import { confirmPreview, requestProfileChanges } from "@/lib/api/interview";
import { FeaturedProfile } from "@/types/api";

export default function InterviewPreview({
  token,
  name,
  profile,
}: {
  token: string;
  name: string;
  profile: FeaturedProfile;
}) {
  const [asking, setAsking] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<"confirmed" | "changes" | null>(null);

  const confirm = async () => {
    setBusy(true);
    setError("");
    try {
      await confirmPreview(token);
      setResult("confirmed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const sendChanges = async () => {
    if (!note.trim()) return;
    setBusy(true);
    setError("");
    try {
      await requestProfileChanges(token, note.trim());
      setResult("changes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-6">
        <div className="max-w-lg text-center">
          <h1 className="font-playfair text-3xl font-bold text-purple">
            Thank you
          </h1>
          <p className="mt-4 leading-relaxed text-tewa-black/70">
            {result === "confirmed"
              ? "You have confirmed your profile. We will let you know when it goes live."
              : "We have received your notes. We will update your profile and send you a new preview."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
          Final review
        </p>
        <h1 className="mt-3 font-playfair text-4xl font-bold text-purple">
          Your profile preview
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-tewa-black/80">
          {name}, this is exactly how your profile will appear on TEWA. Please
          check your name, titles, photos and answers. Nothing goes live until
          you confirm.
        </p>

        <div className="mt-10">
          <ProfileView profile={profile} />
        </div>

        <div className="mt-12 max-w-2xl border-t border-tewa-black/10 pt-8">
          {asking ? (
            <div>
              <label className="block text-sm font-semibold text-tewa-black">
                What would you like changed?
              </label>
              <textarea
                rows={5}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-3 w-full border border-tewa-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-purple"
              />
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={sendChanges}
                  disabled={busy || !note.trim()}
                  className="bg-purple px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-tewa-black disabled:opacity-50"
                >
                  {busy ? "SENDING…" : "SEND NOTES"}
                </button>
                <button
                  onClick={() => setAsking(false)}
                  className="px-5 py-3 text-sm font-semibold text-tewa-black/60 hover:text-tewa-black"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <div>
              {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={confirm}
                  disabled={busy}
                  className="bg-purple px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-tewa-black disabled:opacity-50"
                >
                  {busy ? "CONFIRMING…" : "CONFIRM MY PROFILE"}
                </button>
                <button
                  onClick={() => setAsking(true)}
                  className="border border-purple px-7 py-3 text-sm font-semibold text-purple transition-colors hover:bg-purple hover:text-white"
                >
                  REQUEST CHANGES
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
