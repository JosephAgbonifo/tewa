"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  adminGetFeatured,
  adminSaveProfile,
  adminRequestChanges,
  adminApprove,
} from "@/lib/api/featured";
import ProfileView from "@/components/featured/profile-view";
import { AdminFeaturedDetail } from "@/types/api";

// Actions unlock once the person has submitted
const REVIEWABLE = ["submitted"];

// Never shown publicly (Q1 only decides the printed name). Matches the server.
const UNLISTED = [1];

const STATUS_LABEL: Record<string, string> = {
  invited: "Invited, not started",
  draft: "In progress",
  submitted: "Submitted, ready for review",
  changes_requested: "Sent back to the person",
  approved: "Live",
};

const inputCls =
  "w-full border border-tewa-black/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple";

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const featuredId = Number(id);

  const [detail, setDetail] = useState<AdminFeaturedDetail | null>(null);
  const [loadError, setLoadError] = useState("");

  // editable fields
  const [name, setName] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
  const [titleInput, setTitleInput] = useState("");
  const [social, setSocial] = useState("");
  const [tagline, setTagline] = useState("");
  const [location, setLocation] = useState("");
  const [publicNums, setPublicNums] = useState<number[]>([]);

  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    adminGetFeatured(token, featuredId)
      .then((d) => {
        setDetail(d);
        setName(d.name ?? "");
        setTitles(d.titles);
        setSocial(d.social_url ?? "");
        setTagline(d.tagline ?? "");
        setLocation(d.location ?? "");

        // Default: publish every answered, non-private question.
        // Untick any you want to hide.
        const loaded = d.answers && !Array.isArray(d.answers) ? d.answers : {};
        const safe = d.chapters
          .flatMap((c) => c.questions)
          .filter(
            (q) =>
              !q.private &&
              !UNLISTED.includes(q.n) &&
              loaded[String(q.n)]?.trim()
          )
          .map((q) => q.n);
        setPublicNums(d.public_answers.length > 0 ? d.public_answers : safe);
      })
      .catch(() => setLoadError("Could not load this entry."));
  }, [token, featuredId]);

  if (loadError) return <p className="text-sm text-red-600">{loadError}</p>;
  if (!detail) return <p className="text-sm text-text-dark/50">Loading…</p>;

  const answers =
    detail.answers && !Array.isArray(detail.answers) ? detail.answers : {};
  const signoff =
    detail.signoff && !Array.isArray(detail.signoff) ? detail.signoff : {};
  const canReview = REVIEWABLE.includes(detail.status);
  const isLive = detail.status === "approved";
  const displayName = detail.name ?? "this person";

  const addTitle = () => {
    const t = titleInput.trim();
    if (t && !titles.includes(t)) setTitles((prev) => [...prev, t]);
    setTitleInput("");
  };

  const togglePublic = (n: number) =>
    setPublicNums((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );

  const publicSafe = detail.chapters
    .flatMap((c) => c.questions)
    .filter(
      (q) =>
        !q.private && !UNLISTED.includes(q.n) && answers[String(q.n)]?.trim()
    )
    .map((q) => q.n);

  const persist = async () => {
    if (!token) return;
    // include a title still sitting in the input
    const finalTitles = titleInput.trim()
      ? [...titles, titleInput.trim()]
      : titles;
    if (finalTitles !== titles) {
      setTitles(finalTitles);
      setTitleInput("");
    }
    const d = await adminSaveProfile(token, featuredId, {
      name: name.trim(),
      titles: finalTitles,
      social_url: social.trim(),
      tagline: tagline.trim(),
      location: location.trim(),
      public_answers: publicNums,
    });
    setDetail(d);
  };

  const run = async (label: string, fn: () => Promise<void>) => {
    setBusy(label);
    setMessage("");
    try {
      await fn();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  };

  const handleSave = () =>
    run("save", async () => {
      await persist();
      setMessage("Saved.");
    });

  const handleApprove = () => {
    if (
      !confirm(
        `Publish ${displayName} now? They will go live and become the current feature.`
      )
    )
      return;
    run("approve", async () => {
      await persist();
      if (!token) return;
      setDetail(await adminApprove(token, featuredId));
      setMessage("Published. This person is now the current feature.");
    });
  };

  const handleRequestChanges = () =>
    run("changes", async () => {
      if (!token || !note.trim()) return;
      setDetail(await adminRequestChanges(token, featuredId, note.trim()));
      setNote("");
      setShowNote(false);
      setMessage(
        "Sent back. Share their interview link so they can edit and resubmit."
      );
    });

  const copyLink = async () => {
    if (!detail.interview_url) return;
    await navigator.clipboard.writeText(detail.interview_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div>
      <Link
        href="/admin/featured"
        className="text-xs font-semibold text-tewa-black/50 hover:text-tewa-black"
      >
        ← BACK TO FEATURED
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-tewa-black">
            {displayName}
          </h1>
          <p className="mt-1 text-sm text-text-dark/60">
            {STATUS_LABEL[detail.status] ?? detail.status}
            {detail.email && <> · {detail.email}</>}
          </p>
        </div>
        <div className="flex gap-4 text-sm font-semibold">
          {isLive && (
            <Link
              href={`/featured/${detail.slug}`}
              target="_blank"
              className="text-purple hover:text-gold"
            >
              VIEW LIVE PROFILE
            </Link>
          )}
          {detail.interview_url && !isLive && (
            <button onClick={copyLink} className="text-purple hover:text-gold">
              {copied ? "COPIED" : "COPY INTERVIEW LINK"}
            </button>
          )}
        </div>
      </div>

      {detail.change_note && (
        <div className="mt-6 border-l-4 border-gold bg-white p-4 text-sm">
          <p className="font-semibold text-tewa-black">
            Your note to the person
          </p>
          <p className="mt-1 whitespace-pre-line text-tewa-black/80">
            {detail.change_note}
          </p>
        </div>
      )}

      {/* ---------- Card and profile details ---------- */}
      <section className="mt-10">
        <h2 className="font-playfair text-xl font-bold text-tewa-black">
          Card and profile details
        </h2>
        <div className="mt-5 grid max-w-3xl gap-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">
              Name (as shown in print)
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
            {answers["1"] && (
              <p className="mt-1.5 text-xs text-tewa-black/50">
                They wrote (Q1): {answers["1"]}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Titles</label>
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTitle();
                }
              }}
              placeholder="Type a title and press Enter"
              className={inputCls}
            />
            {titles.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {titles.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2 bg-purple/10 px-3 py-1 text-xs text-purple"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() =>
                        setTitles((prev) => prev.filter((x) => x !== t))
                      }
                      aria-label={`Remove ${t}`}
                      className="font-bold hover:text-red-600"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {answers["2"] && (
              <p className="mt-2 text-xs text-tewa-black/50">
                They wrote (Q2): {answers["2"]}
              </p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-semibold">
                Tagline (shown on the card)
              </label>
              {answers["4"] && (
                <button
                  type="button"
                  onClick={() => setTagline(answers["4"].slice(0, 500))}
                  className="text-xs font-semibold text-purple hover:text-gold"
                >
                  USE THEIR Q4 ANSWER
                </button>
              )}
            </div>
            <textarea
              rows={3}
              maxLength={500}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">
              Location
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">
              Social / bio link
            </label>
            <input
              type="url"
              value={social}
              onChange={(e) => setSocial(e.target.value)}
              placeholder="https://..."
              className={inputCls}
            />
          </div>
          {answers["2"] && (
            <p className="mt-1.5 text-xs text-tewa-black/50">
              They wrote (Q2): {answers["2"]}
            </p>
          )}
        </div>
      </section>

      {/* ---------- Photos ---------- */}
      <section className="mt-12">
        <h2 className="font-playfair text-xl font-bold text-tewa-black">
          Photos
        </h2>
        <p className="mt-1 text-sm text-text-dark/60">
          The first photo is the main one. Credit:{" "}
          {detail.photo_credit || "none given"}.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          {detail.images.map((src, i) => (
            <div key={src}>
              <div className="relative h-40 w-32 overflow-hidden bg-purple/10">
                <Image
                  src={src}
                  alt={`Photo ${i + 1}`}
                  fill
                  sizes="128px"
                  className="object-cover object-top"
                />
              </div>
              {detail.originals[i] && (
                <a
                  href={detail.originals[i]}
                  className="mt-2 block text-xs font-semibold text-purple hover:text-gold"
                >
                  DOWNLOAD ORIGINAL
                </a>
              )}
            </div>
          ))}
          {detail.images.length === 0 && (
            <p className="text-sm text-text-dark/50">No photos uploaded.</p>
          )}
        </div>
      </section>

      {/* ---------- Answers ---------- */}
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-playfair text-xl font-bold text-tewa-black">
              Answers
            </h2>
            <p className="mt-1 text-sm text-text-dark/60">
              Every answer is published unless you untick it (
              {publicNums.length} selected). Private answers can never be shown.
              Save to apply.
            </p>
          </div>
          <div className="flex gap-4 text-xs font-semibold">
            <button
              onClick={() => setPublicNums(publicSafe)}
              className="text-purple hover:text-gold"
            >
              SELECT ALL
            </button>
            <button
              onClick={() => setPublicNums([])}
              className="text-tewa-black/60 hover:text-tewa-black"
            >
              CLEAR
            </button>
          </div>
        </div>

        {detail.chapters.map((c) => {
          const items = c.questions.filter((q) => answers[String(q.n)]?.trim());
          if (items.length === 0) return null;
          return (
            <div key={c.key} className="mt-8">
              <h3 className="font-playfair text-lg font-bold text-tewa-black">
                {c.starred && "★ "}
                {c.title}
              </h3>
              <div className="mt-4 flex flex-col gap-4">
                {items.map((q) => (
                  <div
                    key={q.n}
                    className="border border-tewa-black/10 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-semibold text-purple">
                        <span className="mr-2 text-gold-dark">
                          {String(q.n).padStart(2, "0")}
                        </span>
                        {q.text}
                      </p>
                      {q.private ? (
                        <span className="shrink-0 text-xs font-semibold text-tewa-black/40">
                          PRIVATE
                        </span>
                      ) : UNLISTED.includes(q.n) ? (
                        <span className="shrink-0 text-xs font-semibold text-tewa-black/40">
                          USED FOR NAME
                        </span>
                      ) : (
                        <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs font-semibold text-tewa-black/70">
                          <input
                            type="checkbox"
                            checked={publicNums.includes(q.n)}
                            onChange={() => togglePublic(q.n)}
                            className="h-4 w-4 accent-purple"
                          />
                          SHOW ON PROFILE
                        </label>
                      )}
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-tewa-black/85">
                      {answers[String(q.n)]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {Object.keys(answers).length === 0 && (
          <p className="mt-6 text-sm text-text-dark/50">No answers yet.</p>
        )}
      </section>

      {/* ---------- Sign-off (admin eyes only) ---------- */}
      <section className="mt-12">
        <h2 className="font-playfair text-xl font-bold text-tewa-black">
          Sign-off (never public)
        </h2>
        <dl className="mt-4 grid max-w-3xl gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold text-tewa-black/50">
              PREFERRED COVER NAME / TITLE
            </dt>
            <dd>{signoff.cover_name || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-tewa-black/50">
              CONTACT FOR FACT-CHECKING
            </dt>
            <dd>{signoff.contact || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-tewa-black/50">
              SIGNATURE
            </dt>
            <dd className="font-playfair italic">{signoff.signature || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-tewa-black/50">
              DATE SIGNED
            </dt>
            <dd>{signoff.date || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-tewa-black/50">
              PUBLICATION CONSENT
            </dt>
            <dd>
              {(signoff.consents ?? []).length > 0 &&
              (signoff.consents ?? []).every(Boolean)
                ? "Given"
                : "Not given"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-tewa-black/50">
              SUBMITTED
            </dt>
            <dd>
              {detail.submitted_at
                ? new Date(detail.submitted_at).toLocaleString()
                : "—"}
            </dd>
          </div>
        </dl>
      </section>

      {/* ---------- Preview ---------- */}
      <section className="mt-12">
        <button
          onClick={() => setShowPreview((v) => !v)}
          className="text-sm font-semibold text-purple hover:text-gold"
        >
          {showPreview
            ? "HIDE PROFILE PREVIEW"
            : "SHOW PROFILE PREVIEW (reflects your last save)"}
        </button>
        {showPreview && (
          <div className="mt-6 border border-tewa-black/10 bg-white p-6">
            <ProfileView profile={detail.profile} />
          </div>
        )}
      </section>

      {showNote && (
        <section className="mt-10 max-w-2xl">
          <label className="block text-sm font-semibold">
            Note to {displayName} (what should they fix?)
          </label>
          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`${inputCls} mt-2`}
          />
          <div className="mt-3 flex gap-3">
            <button
              onClick={handleRequestChanges}
              disabled={busy !== null || !note.trim()}
              className="bg-purple px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-tewa-black disabled:opacity-50"
            >
              {busy === "changes" ? "SENDING…" : "SEND BACK"}
            </button>
            <button
              onClick={() => setShowNote(false)}
              className="px-4 py-2.5 text-sm font-semibold text-tewa-black/60 hover:text-tewa-black"
            >
              CANCEL
            </button>
          </div>
        </section>
      )}

      {/* ---------- Action bar ---------- */}
      <div className="sticky bottom-0 z-20 -mx-10 mt-12 border-t border-tewa-black/10 bg-white px-10 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSave}
            disabled={busy !== null}
            className="border border-purple px-6 py-2.5 text-sm font-semibold text-purple transition-colors hover:bg-purple hover:text-white disabled:opacity-50"
          >
            {busy === "save" ? "SAVING…" : "SAVE CHANGES"}
          </button>

          {canReview && (
            <>
              <button
                onClick={() => setShowNote(true)}
                disabled={busy !== null}
                className="px-4 py-2.5 text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                SEND BACK FOR CHANGES
              </button>
              <button
                onClick={handleApprove}
                disabled={busy !== null}
                className="ml-auto bg-purple px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-tewa-black disabled:opacity-50"
              >
                {busy === "approve" ? "PUBLISHING…" : "APPROVE AND GO LIVE"}
              </button>
            </>
          )}

          {!canReview && !isLive && (
            <span className="text-xs text-tewa-black/50">
              Publishing unlocks once the person submits their interview.
            </span>
          )}
          {isLive && (
            <span className="text-xs text-tewa-black/50">
              Live. Saving updates the public profile and the card immediately.
            </span>
          )}
        </div>
        {message && (
          <p className="mt-3 text-sm text-tewa-black/70">{message}</p>
        )}
      </div>
    </div>
  );
}
