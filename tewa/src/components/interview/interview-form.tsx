"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  getInterview,
  saveInterviewDraft,
  submitInterview,
  uploadInterviewPhoto,
  deleteInterviewPhoto,
} from "@/lib/api/interview";
import { InterviewData, InterviewSignoff } from "@/types/api";

type SaveState = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_MS = 1500;
const fieldCls =
  "w-full border border-tewa-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-purple";

export default function InterviewForm() {
  const { token } = useParams<{ token: string }>();

  const [data, setData] = useState<InterviewData | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [signoff, setSignoff] = useState<InterviewSignoff>({});
  const [photoCredit, setPhotoCredit] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);
  const [photoStatus, setPhotoStatus] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);

  const dirty = useRef(false);

  const minPhotos = data?.min_photos ?? 6;
  const maxPhotos = data?.max_photos ?? 12;

  // ---- load ----
  useEffect(() => {
    getInterview(token)
      .then((d) => {
        setData(d);
        if (d.locked) return;
        const rawAnswers =
          d.answers && !Array.isArray(d.answers) ? d.answers : {};
        setAnswers(
          Object.fromEntries(
            Object.entries(rawAnswers).map(([k, v]) => [Number(k), v])
          )
        );
        setSignoff(d.signoff && !Array.isArray(d.signoff) ? d.signoff : {});
        setPhotoCredit(d.photo_credit ?? "");
        setImages(d.images ?? []);
      })
      .catch(() => setLoadError(true));
  }, [token]);

  // ---- autosave ----
  const save = useCallback(async () => {
    setSaveState("saving");
    try {
      await saveInterviewDraft(token, {
        answers,
        signoff,
        photo_credit: photoCredit,
      });
      dirty.current = false;
      setSaveState("saved");
      return true;
    } catch {
      setSaveState("error");
      return false;
    }
  }, [token, answers, signoff, photoCredit]);

  useEffect(() => {
    if (!dirty.current) return;
    const t = setTimeout(save, AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [save]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  // ---- handlers ----
  const setAnswer = (n: number, value: string) => {
    dirty.current = true;
    setAnswers((prev) => ({ ...prev, [n]: value }));
  };

  const setSignoffField = (key: keyof InterviewSignoff, value: string) => {
    dirty.current = true;
    setSignoff((prev) => ({ ...prev, [key]: value }));
  };

  const toggleConsent = (i: number, checked: boolean) => {
    dirty.current = true;
    setSignoff((prev) => {
      const total = data?.declarations?.length ?? 0;
      const consents = Array.from(
        { length: total },
        (_, idx) => prev.consents?.[idx] ?? false
      );
      consents[i] = checked;
      return { ...prev, consents };
    });
  };

  const handlePhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;

    const room = maxPhotos - images.length;
    const files = picked.slice(0, room);

    setUploading(true);
    setPhotoError(
      picked.length > room
        ? `Only ${room} more photo${
            room === 1 ? "" : "s"
          } fit (maximum ${maxPhotos}). The rest were skipped.`
        : ""
    );

    try {
      for (let i = 0; i < files.length; i++) {
        setPhotoStatus(`Uploading photo ${i + 1} of ${files.length}…`);
        const latest = await uploadInterviewPhoto(token, files[i]);
        setImages(latest);
      }
    } catch (err) {
      setPhotoError(
        err instanceof Error ? err.message : "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
      setPhotoStatus("");
    }
  };

  const removePhoto = async (index: number) => {
    setPhotoError("");
    try {
      setImages(await deleteInterviewPhoto(token, index));
    } catch {
      setPhotoError("Could not remove that photo.");
    }
  };

  const handleSubmit = async () => {
    setSubmitError("");

    if (images.length < minPhotos) {
      setSubmitError(
        `Please upload at least ${minPhotos} photos (you have ${images.length}).`
      );
      return;
    }

    setSubmitting(true);

    if (!(await save())) {
      setSubmitError(
        "Could not save your answers. Check your connection and try again."
      );
      setSubmitting(false);
      return;
    }

    try {
      await submitInterview(token);
      setDone(true);
      window.scrollTo({ top: 0 });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---- states ----
  if (loadError) {
    return (
      <Message
        title="This link is not valid"
        body="Please check the link you were sent, or contact the TEWA editorial team."
      />
    );
  }

  if (!data) {
    return <Message title="Loading…" />;
  }

  if (data.locked || done) {
    return (
      <Message
        title="Thank you"
        body={lockedMessage(data.status, done, data.name)}
      />
    );
  }

  const chapters = data.chapters ?? [];
  const declarations = data.declarations ?? [];
  const totalQuestions = chapters.reduce((n, c) => n + c.questions.length, 0);
  const answered = Object.values(answers).filter((v) => v.trim()).length;
  const percent = totalQuestions
    ? Math.round((answered / totalQuestions) * 100)
    : 0;
  const photosOk = images.length >= minPhotos;

  const saveLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
      ? "All changes saved"
      : saveState === "error"
      ? "Could not save, will retry on your next edit"
      : "Autosave is on";

  return (
    <div className="min-h-screen bg-cream">
      {/* Sticky progress bar */}
      <div className="sticky top-0 z-30 border-b border-tewa-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-tewa-black/10">
            <div
              className="h-full bg-purple transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-tewa-black/70">
            {answered}/{totalQuestions} answered
          </span>
          <span
            className={`hidden text-xs sm:inline ${
              saveState === "error" ? "text-red-600" : "text-tewa-black/50"
            }`}
          >
            {saveLabel}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="mx-auto max-w-6xl px-6 pt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
          TEWA Feature Interview
        </p>
        <h1 className="mt-3 font-playfair text-4xl font-bold text-purple md:text-5xl">
          Your Feature Interview
        </h1>
        <p className="mt-2 text-sm text-tewa-black/60">
          Prepared for <span className="font-semibold">{data.name}</span>
        </p>
        <p className="mt-6 max-w-3xl leading-relaxed text-tewa-black/80">
          {data.intro}
        </p>

        {data.change_note && (
          <div className="mt-6 max-w-3xl border-l-4 border-gold bg-white p-4 text-sm">
            <p className="font-semibold text-tewa-black">
              A note from the editorial team
            </p>
            <p className="mt-1 whitespace-pre-line text-tewa-black/80">
              {data.change_note}
            </p>
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[220px_1fr]">
        {/* Chapter index */}
        <nav className="hidden self-start lg:sticky lg:top-24 lg:block">
          <ul className="flex flex-col gap-2 text-sm">
            {chapters.map((c) => (
              <li key={c.key}>
                <a
                  href={`#${c.key}`}
                  className="text-tewa-black/70 transition-colors hover:text-purple"
                >
                  {c.starred && <span className="mr-1 text-gold-dark">★</span>}
                  {c.title}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#sign-off"
                className="font-semibold text-tewa-black/70 transition-colors hover:text-purple"
              >
                Sign-off
              </a>
            </li>
          </ul>
        </nav>

        <main className="flex flex-col gap-16">
          {chapters.map((chapter) => (
            <section
              key={chapter.key}
              id={chapter.key}
              className="scroll-mt-24"
            >
              <h2 className="font-playfair text-2xl font-bold text-tewa-black">
                {chapter.starred && (
                  <span className="mr-2 text-gold-dark">★</span>
                )}
                {chapter.title}
              </h2>
              <p className="mt-1 text-sm text-tewa-black/60">{chapter.blurb}</p>

              <div className="mt-8 flex flex-col gap-8">
                {chapter.questions.map((q) => (
                  <div key={q.n}>
                    <label
                      htmlFor={`q-${q.n}`}
                      className="flex gap-3 text-sm font-semibold leading-relaxed text-tewa-black"
                    >
                      <span className="text-gold-dark">
                        {String(q.n).padStart(2, "0")}
                      </span>
                      <span>
                        {q.text}
                        {q.required && (
                          <span className="ml-1 text-red-600">*</span>
                        )}
                      </span>
                    </label>

                    <textarea
                      id={`q-${q.n}`}
                      rows={4}
                      value={answers[q.n] ?? ""}
                      onChange={(e) => setAnswer(q.n, e.target.value)}
                      className={`${fieldCls} mt-3 resize-y`}
                      placeholder="Your response"
                    />

                    {q.private && (
                      <p className="mt-1.5 text-xs text-tewa-black/50">
                        Editorial use only. This answer is never published.
                      </p>
                    )}

                    {q.n === data.photo_question && (
                      <div className="mt-5 border border-dashed border-tewa-black/20 bg-white p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-tewa-black">
                            Upload your photos{" "}
                            <span className="text-red-600">*</span>
                          </p>
                          <span
                            className={`px-2.5 py-1 text-xs font-semibold ${
                              photosOk
                                ? "bg-green-100 text-green-700"
                                : "bg-gold/20 text-gold-dark"
                            }`}
                          >
                            {images.length} uploaded
                            {photosOk ? "" : ` · ${minPhotos} minimum`}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-tewa-black/60">
                          Please upload at least {minPhotos} photos (up to{" "}
                          {maxPhotos}): a mix of portraits and photos of you at
                          work or at events. The first photo is your main
                          portrait. Please upload the original, high-resolution
                          files; we keep them privately for print.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-3">
                          {images.map((src, i) => (
                            <div
                              key={src}
                              className="relative h-32 w-28 overflow-hidden bg-purple/10"
                            >
                              <Image
                                src={src}
                                alt={`Your photo ${i + 1}`}
                                fill
                                sizes="112px"
                                className="object-cover object-top"
                              />
                              {i === 0 && (
                                <span className="absolute left-1 top-1 bg-gold px-1.5 py-0.5 text-[10px] font-semibold text-tewa-black">
                                  MAIN
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => removePhoto(i)}
                                disabled={uploading}
                                aria-label={`Remove photo ${i + 1}`}
                                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-xs text-white disabled:opacity-50"
                              >
                                ×
                              </button>
                            </div>
                          ))}

                          {images.length < maxPhotos && (
                            <label className="grid h-32 w-28 cursor-pointer place-items-center border border-dashed border-tewa-black/30 p-2 text-center text-xs text-tewa-black/60 hover:border-purple hover:text-purple">
                              {uploading ? "Uploading…" : "+ Add photos"}
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                disabled={uploading}
                                onChange={handlePhotos}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>

                        {photoStatus && (
                          <p className="mt-3 text-sm text-tewa-black/70">
                            {photoStatus}
                          </p>
                        )}
                        {photoError && (
                          <p className="mt-3 text-sm text-red-600">
                            {photoError}
                          </p>
                        )}

                        <label className="mt-5 block text-xs font-semibold text-tewa-black/70">
                          Photographer credit
                        </label>
                        <input
                          value={photoCredit}
                          onChange={(e) => {
                            dirty.current = true;
                            setPhotoCredit(e.target.value);
                          }}
                          placeholder="Photo by…"
                          className={`${fieldCls} mt-1.5`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Sign-off */}
          <section
            id="sign-off"
            className="scroll-mt-24 border-t border-tewa-black/10 pt-12"
          >
            <h2 className="font-playfair text-2xl font-bold text-tewa-black">
              Declaration of Originality and Consent
            </h2>
            <p className="mt-1 text-sm text-tewa-black/60">
              Please read each statement, then complete the details below to
              confirm that your responses are your original write-up.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {declarations.map((text, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer gap-3 text-sm leading-relaxed"
                >
                  <input
                    type="checkbox"
                    checked={signoff.consents?.[i] ?? false}
                    onChange={(e) => toggleConsent(i, e.target.checked)}
                    className="mt-1 h-4 w-4 accent-purple"
                  />
                  <span>{text}</span>
                </label>
              ))}
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-tewa-black/70">
                  Full name
                </label>
                <input
                  value={signoff.full_name ?? ""}
                  onChange={(e) => setSignoffField("full_name", e.target.value)}
                  className={fieldCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-tewa-black/70">
                  Title and organization
                </label>
                <input
                  value={signoff.title_org ?? ""}
                  onChange={(e) => setSignoffField("title_org", e.target.value)}
                  className={fieldCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-tewa-black/70">
                  Signature (type your full name)
                </label>
                <input
                  value={signoff.signature ?? ""}
                  onChange={(e) => setSignoffField("signature", e.target.value)}
                  className={`${fieldCls} font-playfair italic`}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-tewa-black/70">
                  Email and phone
                </label>
                <input
                  value={signoff.contact ?? ""}
                  onChange={(e) => setSignoffField("contact", e.target.value)}
                  className={fieldCls}
                />
              </div>
            </div>

            <p className="mt-4 text-xs text-tewa-black/50">
              Date: {new Date().toLocaleDateString()}
            </p>
            <p className="mt-6 text-xs text-tewa-black/60">{data.closing}</p>

            {!photosOk && (
              <p className="mt-6 text-sm text-gold-dark">
                You have {images.length} of the {minPhotos} photos needed to
                submit.
              </p>
            )}

            {submitError && (
              <p className="mt-4 text-sm text-red-600">{submitError}</p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={save}
                disabled={submitting}
                className="border border-purple px-7 py-3 text-sm font-semibold text-purple transition-colors hover:bg-purple hover:text-white disabled:opacity-50"
              >
                SAVE DRAFT
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || uploading}
                className="bg-purple px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-tewa-black disabled:opacity-50"
              >
                {submitting ? "SUBMITTING…" : "SUBMIT INTERVIEW"}
              </button>
              <span className="text-xs text-tewa-black/50">{saveLabel}</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Message({ title, body }: { title: string; body?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-cream px-6">
      <div className="max-w-lg text-center">
        <h1 className="font-playfair text-3xl font-bold text-purple">
          {title}
        </h1>
        {body && (
          <p className="mt-4 leading-relaxed text-tewa-black/70">{body}</p>
        )}
      </div>
    </div>
  );
}

function lockedMessage(status: string, done: boolean, name: string) {
  const who = name ? `, ${name}` : "";
  if (!done && status === "approved")
    return `Your profile is live on TEWA. Thank you${who}.`;
  return `Your interview has been received${who}. Our editorial team will review it and publish your profile on TEWA.`;
}
