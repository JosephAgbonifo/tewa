"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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

const btn =
  "min-h-[50px] rounded-[2px] px-[26px] py-3.5 text-sm font-bold tracking-[0.08em] transition-colors disabled:opacity-50";
const btnPrimary = `${btn} bg-iv-purple text-iv-ivory hover:bg-iv-purple-2`;
const btnGold = `${btn} bg-iv-gold text-[#111] hover:brightness-95`;
const btnGhost = `${btn} border-2 border-iv-purple bg-transparent text-iv-purple hover:bg-iv-purple hover:text-iv-ivory`;
const inputCls =
  "w-full rounded-[2px] border border-iv-line bg-iv-ivory px-3.5 py-3 text-base text-[#111] outline-none focus:ring-[3px] focus:ring-iv-gold/55";
const labelCls =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-iv-gold-d";
const cardCls = "mt-4 border border-iv-line bg-white px-[22px] py-5";
const kickerCls =
  "text-xs font-bold uppercase tracking-[0.24em] text-iv-gold-d";

const wordCount = (s: string) => (s.trim().match(/\S+/g) || []).length;
const todayLocal = () => new Date().toLocaleDateString("en-CA"); // yyyy-mm-dd

function AutoTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [props.value]);
  return <textarea ref={ref} {...props} />;
}

// Last word of a chapter title is set in italics, like the magazine design
function ChapterTitle({ title, emClass }: { title: string; emClass: string }) {
  const i = title.lastIndexOf(" ");
  if (i === -1) return <em className={`italic ${emClass}`}>{title}</em>;
  return (
    <>
      {title.slice(0, i + 1)}
      <em className={`italic ${emClass}`}>{title.slice(i + 1)}</em>
    </>
  );
}

export default function InterviewForm() {
  const { token } = useParams<{ token: string }>();

  const [data, setData] = useState<InterviewData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [screen, setScreen] = useState(0); // 0 welcome, 1..N chapters, N+1 finish
  const [showRequired, setShowRequired] = useState(false);

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
        const so = d.signoff && !Array.isArray(d.signoff) ? d.signoff : {};
        setSignoff({ ...so, date: so.date || todayLocal() });
        setPhotoCredit(d.photo_credit ?? "");
        setImages(d.images ?? []);
        try {
          const saved = Number(
            localStorage.getItem(`tewa-interview-screen:${token}`)
          );
          if (Number.isFinite(saved) && saved > 0) setScreen(saved);
        } catch {
          /* storage unavailable: start at the welcome screen */
        }
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

  const setSignoffField = (
    key: Exclude<keyof InterviewSignoff, "consents">,
    value: string
  ) => {
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

  // ---- states ----
  if (loadError) {
    return (
      <Message
        title="This link is not valid"
        body="Please check the link you were sent, or contact the TEWA editorial team."
      />
    );
  }

  if (!data) return <Message title="Loading…" />;

  if (data.locked || done) {
    return (
      <Message
        title="Thank you"
        body={lockedMessage(data.status, done, data.name)}
      />
    );
  }

  // ---- derived ----
  const chapters = data.chapters ?? [];
  const declarations = data.declarations ?? [];
  const welcome = data.welcome;
  const finishScreen = chapters.length + 1;
  const current = Math.min(screen, finishScreen);

  const totalQuestions = chapters.reduce((n, c) => n + c.questions.length, 0);
  const answered = Object.values(answers).filter((v) => v.trim()).length;
  const percent = totalQuestions
    ? Math.round((answered / totalQuestions) * 100)
    : 0;
  const photosOk = images.length >= minPhotos;
  const firstName = (data.name ?? "").trim().split(/\s+/)[0] || "You";

  const firstMissing = chapters.flatMap((c, ci) =>
    c.questions
      .filter((q) => q.required && !(answers[q.n] ?? "").trim())
      .map((q) => ({ n: q.n, screen: ci + 1 }))
  )[0];

  const meterText =
    current === 0
      ? "YOUR STORY"
      : current === finishScreen
      ? "FINAL STEP"
      : `CHAPTER ${current} · ${chapters[current - 1].title.toUpperCase()}`;

  const saveLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
      ? "All changes saved"
      : saveState === "error"
      ? "Could not save, will retry on your next edit"
      : "Your answers save automatically";

  const go = (n: number) => {
    const target = Math.max(0, Math.min(finishScreen, n));

    // The essential question must be answered before moving past its chapter
    if (firstMissing && target > firstMissing.screen) {
      setShowRequired(true);
      setScreen(firstMissing.screen);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setScreen(target);
    try {
      localStorage.setItem(`tewa-interview-screen:${token}`, String(target));
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setSubmitError("");

    if (firstMissing) {
      setShowRequired(true);
      setScreen(firstMissing.screen);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (images.length < minPhotos) {
      setSubmitError(
        `Please upload at least ${minPhotos} photos (you have ${images.length}).`
      );
      return;
    }
    const consents = signoff.consents ?? [];
    if (declarations.length > 0 && !declarations.every((_, i) => consents[i])) {
      setSubmitError("Please tick the publication permission box.");
      return;
    }
    if (!(signoff.signature ?? "").trim()) {
      setSubmitError("Please type your full name as your signature.");
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

  return (
    <div className="flex min-h-screen flex-col bg-iv-ivory font-iv-sans leading-[1.55] text-[#111]">
      {/* ---------- Masthead ---------- */}
      <header className="border-b-4 border-iv-gold bg-iv-purple text-iv-ivory">
        <div className="mx-auto flex w-full max-w-[780px] flex-wrap items-center justify-between gap-4 px-[22px] py-3.5">
          <div className="font-iv-serif text-[38px] font-bold leading-none tracking-[4px] text-iv-gold">
            TEWA
            <span className="mt-1 block font-iv-sans text-[9px] font-bold tracking-[0.38em] text-iv-ivory">
              THE EXECUTIVE WOMAN AFRICA
            </span>
          </div>
          <div className="min-w-[220px] max-w-[340px] flex-1">
            <div className="mb-1.5 flex justify-between gap-3 text-[11px] font-bold tracking-[0.12em]">
              <span className="min-w-0 truncate">{meterText}</span>
              <span className="text-iv-gold">{percent}%</span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-white/20"
              role="progressbar"
              aria-label="Questionnaire progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
            >
              <span
                className="block h-full bg-iv-gold transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[780px] flex-1 px-[22px]">
        {/* ---------- Chapter dots ---------- */}
        <nav
          className="mt-[22px] flex flex-wrap justify-center gap-1.5"
          aria-label="Chapters"
        >
          {chapters.map((c, i) => {
            const n = i + 1;
            const isCurrent = current === n;
            const hasAnswer = c.questions.some((q) =>
              (answers[q.n] ?? "").trim()
            );
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => go(n)}
                aria-label={`Chapter ${n}: ${c.title}`}
                aria-current={isCurrent ? "step" : undefined}
                className={`h-9 w-9 rounded-full border-2 font-iv-serif text-[15px] ${
                  isCurrent
                    ? "border-iv-purple bg-iv-purple text-iv-gold"
                    : hasAnswer
                    ? "border-iv-gold bg-iv-champ text-iv-purple"
                    : "border-iv-gold bg-white text-iv-purple"
                }`}
              >
                {n}
              </button>
            );
          })}
        </nav>

        {/* ---------- Welcome ---------- */}
        {current === 0 && (
          <section className="iv-rise pb-5 pt-14 text-center">
            <p className={`${kickerCls} mb-2.5`}>
              The TEWA Executive Interview
            </p>
            <h1 className="mb-[18px] font-iv-serif text-[clamp(40px,8vw,72px)] font-normal leading-none">
              Cover Story
              <br />
              <em className="italic text-iv-orchid">Questionnaire</em>
            </h1>
            <p className="mx-auto mb-7 max-w-[600px] font-iv-serif text-[clamp(19px,2.6vw,23px)] italic">
              {welcome?.lede}
            </p>

            <div className="mx-auto mb-8 grid max-w-[620px] grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                [String(chapters.length), "chapters"],
                [
                  welcome?.minutes ?? "45–60",
                  "minutes, for selected questions",
                ],
                ["1", "cover story"],
              ].map(([big, label]) => (
                <div
                  key={label}
                  className="border border-iv-line bg-white px-2.5 py-4"
                >
                  <b className="block font-iv-serif text-[30px] font-normal leading-none text-iv-purple">
                    {big}
                  </b>
                  <span className="text-xs font-semibold tracking-[0.06em]">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mx-auto mb-[26px] max-w-[680px] border border-iv-line bg-white px-[22px] py-5 text-left">
              <p className="mb-2 font-iv-serif text-[19px] font-bold">
                {welcome?.greeting}
              </p>
              <p className="mb-3.5">{welcome?.letter}</p>
              <p className={`${kickerCls} mb-1.5`}>How to participate</p>
              <ol className="list-decimal space-y-1 pl-5 text-[15px]">
                {welcome?.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>

            <button type="button" className={btnPrimary} onClick={() => go(1)}>
              Let’s begin
            </button>
            <p className="mx-auto mt-[18px] max-w-[560px] text-[13px] text-[#444]">
              You do not need to answer every question. Your answers save
              automatically to your private link, so you can stop and come back
              on any device.
            </p>
          </section>
        )}

        {/* ---------- Chapters ---------- */}
        {chapters.map((c, ci) => {
          const n = ci + 1;
          if (current !== n) return null;

          return (
            <section key={c.key} className="iv-rise pb-2.5 pt-[34px]">
              <div className="relative overflow-hidden bg-iv-purple px-[30px] py-[26px] text-iv-ivory max-[560px]:p-[22px]">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border-[18px] border-iv-gold/20" />
                <div className="text-xs font-bold tracking-[0.26em] text-iv-gold">
                  CHAPTER {String(n).padStart(2, "0")} OF{" "}
                  {String(chapters.length).padStart(2, "0")}
                </div>
                <h2 className="my-1.5 font-iv-serif text-[clamp(32px,5.5vw,46px)] font-normal leading-[1.05]">
                  <ChapterTitle title={c.title} emClass="text-iv-gold" />
                </h2>
                <p className="max-w-[520px] font-iv-serif text-lg italic text-iv-gold">
                  {c.blurb}
                </p>
                <div className="mt-3 text-[11px] font-bold tracking-[0.16em] opacity-85">
                  {c.starred ? "ESSENTIAL" : "OPTIONAL"} · {c.questions.length}{" "}
                  QUESTIONS
                </div>
              </div>

              {c.questions.map((q) => {
                const value = answers[q.n] ?? "";
                const w = wordCount(value);
                const missing = showRequired && q.required && !value.trim();
                return (
                  <div key={q.n} className={cardCls}>
                    <label
                      htmlFor={`q-${q.n}`}
                      className="mb-1 block font-iv-serif text-[21px] leading-[1.3]"
                    >
                      {q.text}
                      {q.required && " *"}
                    </label>
                    <AutoTextarea
                      id={`q-${q.n}`}
                      rows={c.short ? 2 : 3}
                      value={value}
                      onChange={(e) => setAnswer(q.n, e.target.value)}
                      aria-invalid={missing || undefined}
                      className={`${inputCls} mt-2 resize-y overflow-hidden ${
                        missing ? "border-red-500" : ""
                      }`}
                    />
                    <div
                      className="mt-1 text-right text-xs text-[#555]"
                      aria-hidden
                    >
                      {w
                        ? `${w} word${w === 1 ? "" : "s"}${
                            w >= 50 ? " · great detail" : ""
                          }`
                        : ""}
                    </div>
                    {missing && (
                      <p className="mt-1 text-sm font-semibold text-red-600">
                        Please answer this first. It is the one essential
                        question.
                      </p>
                    )}
                  </div>
                );
              })}

              <p
                className="mt-[22px] min-h-[1.5em] text-center font-iv-serif text-[17px] italic text-iv-orchid"
                aria-live="polite"
              >
                {c.cheer}
              </p>

              <div className="mb-12 mt-7 flex flex-wrap justify-between gap-3">
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => go(n - 1)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className={btnPrimary}
                  onClick={() => go(n + 1)}
                >
                  {n === chapters.length ? "Finish" : "Next chapter"}
                </button>
              </div>
            </section>
          );
        })}

        {/* ---------- Finish ---------- */}
        {current === finishScreen && (
          <section className="iv-rise">
            <div className="pb-2.5 pt-11 text-center">
              <p className={`${kickerCls} mb-2.5`}>
                Chapter {finishScreen} · Editorial assets &amp; permissions
              </p>
              <h2 className="mb-3 font-iv-serif text-[clamp(36px,7vw,60px)] font-normal leading-[1.05]">
                {firstName}, you did it.
              </h2>
              <p className="mx-auto max-w-[560px] font-iv-serif text-xl italic">
                Thank you for sharing the story behind the title. Three quick
                steps and you are on your way to the cover.
              </p>
            </div>

            {/* 1. Photos */}
            <div className={cardCls}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-iv-serif text-[21px]">
                  1. Upload your photos <span className="text-red-600">*</span>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-bold ${
                    photosOk
                      ? "bg-green-100 text-green-700"
                      : "bg-iv-champ text-iv-gold-d"
                  }`}
                >
                  {images.length} uploaded
                  {photosOk ? "" : ` · ${minPhotos} minimum`}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-[#555]">
                Please upload at least {minPhotos} photos (up to {maxPhotos}):
                at least two high-resolution portraits (ideally 2000+ pixels on
                the longest side) plus photographs of you at work or in your
                community. The first photo is your main portrait. We keep your
                original files privately for print.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((src, i) => (
                  <div
                    key={src}
                    className="relative h-32 w-28 overflow-hidden bg-iv-champ"
                  >
                    <Image
                      src={src}
                      alt={`Your photo ${i + 1}`}
                      fill
                      sizes="112px"
                      className="object-cover object-top"
                    />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 bg-iv-gold px-1.5 py-0.5 text-[10px] font-bold text-[#111]">
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
                  <label className="grid h-32 w-28 cursor-pointer place-items-center border-2 border-dashed border-iv-gold p-2 text-center text-xs font-semibold text-iv-purple hover:bg-iv-champ">
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
                <p className="mt-3 text-sm text-[#444]">{photoStatus}</p>
              )}
              {photoError && (
                <p className="mt-3 text-sm text-red-600">{photoError}</p>
              )}

              <div className="mt-5">
                <label htmlFor="photo-credit" className={labelCls}>
                  Photo credits / restrictions
                </label>
                <input
                  id="photo-credit"
                  type="text"
                  value={photoCredit}
                  onChange={(e) => {
                    dirty.current = true;
                    setPhotoCredit(e.target.value);
                  }}
                  className={inputCls}
                />
              </div>

              {(data.email_extras?.length ?? 0) > 0 && (
                <div className="mt-5 border-t border-iv-line pt-4">
                  <p className="text-[13px] font-semibold">
                    Please also email these to{" "}
                    <a
                      className="text-iv-orchid underline"
                      href={`mailto:${data.editor_email}`}
                    >
                      {data.editor_email}
                    </a>
                    :
                  </p>
                  <ul className="mt-1.5 list-disc pl-5 text-[13px] text-[#444]">
                    {data.email_extras?.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 2. Details and permission */}
            <div className={cardCls}>
              <div className="font-iv-serif text-[21px]">
                2. Your details &amp; publication permission
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="cover-name" className={labelCls}>
                    Preferred cover name / title
                  </label>
                  <input
                    id="cover-name"
                    type="text"
                    value={signoff.cover_name ?? ""}
                    onChange={(e) =>
                      setSignoffField("cover_name", e.target.value)
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="fact-contact" className={labelCls}>
                    Preferred contact for fact-checking
                  </label>
                  <input
                    id="fact-contact"
                    type="text"
                    value={signoff.contact ?? ""}
                    onChange={(e) => setSignoffField("contact", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                {declarations.map((text, i) => (
                  <label
                    key={i}
                    className="flex cursor-pointer items-start gap-3 text-[15px]"
                  >
                    <input
                      type="checkbox"
                      checked={signoff.consents?.[i] ?? false}
                      onChange={(e) => toggleConsent(i, e.target.checked)}
                      className="mt-0.5 h-5 w-5 flex-none accent-iv-purple"
                    />
                    <span>{text}</span>
                  </label>
                ))}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="signature" className={labelCls}>
                    Signature (type your full name){" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="signature"
                    type="text"
                    value={signoff.signature ?? ""}
                    onChange={(e) =>
                      setSignoffField("signature", e.target.value)
                    }
                    className={`${inputCls} font-iv-serif italic`}
                  />
                </div>
                <div>
                  <label htmlFor="sign-date" className={labelCls}>
                    Date
                  </label>
                  <input
                    id="sign-date"
                    type="date"
                    value={signoff.date ?? ""}
                    onChange={(e) => setSignoffField("date", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* 3. Send */}
            <div className={cardCls}>
              <div className="font-iv-serif text-[21px]">3. Send it to us</div>
              <p className="mt-1 text-[13px] text-[#555]">
                Press Submit and your interview goes straight to the editorial
                team. You can save a draft and come back at any time before
                then.
              </p>
            </div>

            {!photosOk && (
              <p className="mt-5 text-center text-sm text-iv-gold-d">
                You have {images.length} of the {minPhotos} photos needed to
                submit.
              </p>
            )}
            {submitError && (
              <p className="mt-4 text-center text-sm font-semibold text-red-600">
                {submitError}
              </p>
            )}

            <div className="mb-2.5 mt-[26px] flex flex-wrap justify-center gap-3">
              <button
                type="button"
                className={btnGold}
                onClick={handleSubmit}
                disabled={submitting || uploading}
              >
                {submitting ? "SUBMITTING…" : "SUBMIT MY INTERVIEW"}
              </button>
              <button
                type="button"
                className={btnGhost}
                onClick={save}
                disabled={submitting}
              >
                SAVE DRAFT
              </button>
            </div>
            <p className="min-h-[1.4em] text-center text-[13px] text-iv-gold-d">
              {saveLabel}
            </p>

            <div className="mb-12 mt-7 flex justify-between">
              <button
                type="button"
                className={btnGhost}
                onClick={() => go(finishScreen - 1)}
              >
                Back
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-iv-purple p-[18px] text-center text-[11px] tracking-[0.32em] text-iv-ivory">
        THE TEWA EXECUTIVE INTERVIEW <span className="text-iv-gold">·</span>{" "}
        INSPIRE <span className="text-iv-gold">·</span> ELEVATE{" "}
        <span className="text-iv-gold">·</span> EMPOWER
      </footer>
    </div>
  );
}

function Message({ title, body }: { title: string; body?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-iv-ivory px-6 font-iv-sans">
      <div className="max-w-lg text-center">
        <h1 className="font-iv-serif text-[40px] font-normal leading-tight text-iv-purple">
          {title}
        </h1>
        {body && (
          <p className="mt-4 font-iv-serif text-xl italic leading-relaxed text-[#333]">
            {body}
          </p>
        )}
      </div>
    </div>
  );
}

function lockedMessage(status: string, done: boolean, name: string) {
  const who = name ? `, ${name}` : "";
  if (!done && status === "approved")
    return `Your profile is live on TEWA. Thank you${who}.`;
  return `Your interview has been received${who}. Our editorial team will review it and be in touch about your profile.`;
}
