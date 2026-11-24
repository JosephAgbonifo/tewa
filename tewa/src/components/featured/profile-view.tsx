import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { FeaturedProfile, ProfileChapter } from "@/types/api";

type Item = ProfileChapter["items"][number];
type Block = { kind: "article"; item: Item } | { kind: "quick"; items: Item[] };

const SHORT = 220; // answers up to this length become "quick take" cards

// Chapter backgrounds cycle in this order, so purple repeats evenly down the page
const PALETTE = ["white", "cream"] as const;
type Kind = (typeof PALETTE)[number];

const dropCap = (color: string) =>
  `first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-playfair first-letter:text-7xl first-letter:font-bold first-letter:leading-[0.75] ${color}`;

function paragraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// First full sentence of an answer, used for pull quotes (the person's own words)
function sentence(text: string): string | null {
  const m = text.replace(/\s+/g, " ").match(/^(.{50,190}?[.!?])(\s|$)/);
  return m ? m[1] : null;
}

function toBlocks(items: Item[]): Block[] {
  const blocks: Block[] = [];
  for (const item of items) {
    if (item.answer.trim().length <= SHORT) {
      const last = blocks[blocks.length - 1];
      if (last && last.kind === "quick") last.items.push(item);
      else blocks.push({ kind: "quick", items: [item] });
    } else {
      blocks.push({ kind: "article", item });
    }
  }
  return blocks;
}

function tone(kind: Kind) {
  return {
    section: kind === "cream" ? "bg-cream" : "bg-white",
    num: "text-tewa-black",
    head: "text-gold-dark",
    dek: "text-tewa-black/60",
    rule: "border-gold",
    q: "text-purple",
    body: "text-tewa-black/90",
    pull: "text-purple",
    card: kind === "cream" ? "border-gold bg-white" : "border-gold bg-cream",
    cardQ: "text-gold-dark",
    cardA: "text-tewa-black",
    cap: "first-letter:text-purple",
  };
}

function PhotoBreak({
  src,
  alt,
  quote,
  credit,
}: {
  src: string;
  alt: string;
  quote?: string | null;
  credit?: string | null;
}) {
  return (
    <figure className="relative h-[360px] w-full overflow-hidden bg-tewa-black md:h-[520px]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover object-[50%_25%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />
      {quote && (
        <blockquote className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-6 pb-14 text-center font-playfair text-2xl italic leading-snug text-white md:text-4xl">
          “{quote}”
        </blockquote>
      )}
      {credit && (
        <figcaption className="absolute bottom-4 right-6 text-[10px] uppercase tracking-widest text-white/60">
          Photography: {credit}
        </figcaption>
      )}
    </figure>
  );
}

export default function ProfileView({ profile }: { profile: FeaturedProfile }) {
  const [main, ...rest] = profile.images;
  const chapters = profile.chapters;
  const allItems = chapters.flatMap((c) => c.items);
  const N = chapters.length;

  const words = allItems.reduce((n, i) => n + i.answer.split(/\s+/).length, 0);
  const minutes = Math.max(1, Math.round(words / 200));

  // Chapter backgrounds: white → cream → purple, repeating. Shifted when needed
  // so the last chapter is never purple (the closing quote band after it is purple).
  const shift = N > 0 && (N - 1) % 3 === 2 ? 1 : 0;
  const kindOf = (i: number): Kind => PALETTE[(i + shift) % 3];
  const lastKind: Kind = kindOf(Math.max(N - 1, 0));

  // Quotes available for photo breaks (first sentences of long answers)
  const quotes = allItems
    .filter((i) => i.answer.length > 300)
    .map((i) => sentence(i.answer))
    .filter((q): q is string => Boolean(q));

  // Up to 4 full-bleed photo breaks, one per spare photo, spread across the chapters
  const breakCount =
    N >= 2 ? Math.min(Math.max(rest.length, main ? 1 : 0), N - 1, 4) : 0;
  const breakAfter = Array.from(
    new Set(
      Array.from(
        { length: breakCount },
        (_, k) => Math.floor(((k + 1) * N) / (breakCount + 1)) - 1
      )
    )
  ).filter((i) => i >= 0 && i < N - 1);
  const photoFor = (k: number) => rest[k] ?? (k === 0 ? main : undefined);
  const leftover = rest.slice(breakAfter.length);

  // Closing quote: prefer the legacy / future / advice answers
  const closingItem = [22, 23, 21, 20]
    .map((n) => allItems.find((i) => i.n === n))
    .find(Boolean);
  const closingText = closingItem
    ? closingItem.answer.length <= 260
      ? closingItem.answer
      : sentence(closingItem.answer)
    : null;

  const glance = [
    profile.location && { label: "Based in", value: profile.location },
    profile.titles.length > 0 && {
      label: profile.titles.length > 1 ? "Roles" : "Role",
      value: profile.titles.join(" · "),
    },
    words > 0 && { label: "Reading time", value: `${minutes} min read` },
  ].filter(Boolean) as { label: string; value: string }[];

  let articleCount = 0; // drives the pull-quote rhythm across the whole page

  return (
    <article>
      {/* ---------- Cover ---------- */}
      <section className="grid grid-cols-1 overflow-hidden md:grid-cols-[5fr_7fr]">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-purple/30 md:aspect-auto md:min-h-[640px]">
          {main && (
            <Image
              src={main}
              alt={profile.name}
              fill
              priority
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover object-top"
            />
          )}
        </div>

        <div className="flex flex-col justify-center gap-7 bg-tewa-black px-8 py-14 md:px-14 lg:px-20">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            TEWA Featured
          </span>

          <h1 className="font-playfair text-5xl font-bold italic leading-[1.05] text-white md:text-6xl lg:text-7xl">
            {profile.name}
          </h1>

          <div className="h-0.5 w-20 bg-gold" />

          {profile.titles.length > 0 && (
            <ul className="flex flex-col gap-2 border-l-2 border-gold pl-4 text-sm uppercase tracking-widest text-white/80">
              {profile.titles.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}

          {profile.tagline && (
            <p className="max-w-xl font-lora text-xl leading-relaxed text-white/75">
              {profile.tagline}
            </p>
          )}

          {profile.location && (
            <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
              <MapPin className="h-3.5 w-3.5 text-gold" />
              {profile.location}
            </p>
          )}

          {profile.social_url && (
            <Link
              href={profile.social_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex w-fit items-center gap-2 bg-gold px-6 py-3 text-sm font-semibold text-tewa-black transition-colors hover:bg-white"
            >
              Follow {profile.name}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      {/* ---------- At a glance ---------- */}
      {glance.length > 0 && (
        <section className="border-b border-tewa-black/10 bg-cream">
          <dl className="mx-auto grid max-w-6xl gap-6 px-6 py-6 sm:grid-cols-3">
            {glance.map((g) => (
              <div key={g.label}>
                <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark">
                  {g.label}
                </dt>
                <dd className="mt-1 font-playfair text-lg text-tewa-black">
                  {g.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* ---------- Contents strip ---------- */}
      {chapters.length > 1 && (
        <nav className="border-b border-tewa-black/10 bg-white">
          <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-6 py-4 text-sm">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
              In this profile
            </span>
            {chapters.map((c, i) => (
              <a
                key={c.key}
                href={`#${c.key}`}
                className="shrink-0 text-tewa-black/70 transition-colors hover:text-purple"
              >
                <span className="mr-1.5 text-tewa-black">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {c.title}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* ---------- Chapters ---------- */}
      {chapters.map((c, ci) => {
        const t = tone(kindOf(ci));
        const blocks = toBlocks(c.items);
        const firstArticle = blocks.findIndex((b) => b.kind === "article");
        const breakIndex = breakAfter.indexOf(ci);
        const breakSrc = breakIndex >= 0 ? photoFor(breakIndex) : undefined;

        return (
          <div key={c.key}>
            <section
              id={c.key}
              className={`${t.section} scroll-mt-4 py-16 md:py-20`}
            >
              <div className="mx-auto max-w-5xl px-6">
                <header
                  className={`flex flex-wrap items-end gap-x-5 gap-y-1 border-b pb-4 ${t.rule}`}
                >
                  <span
                    className={`font-playfair text-6xl font-bold leading-none ${t.num}`}
                  >
                    {String(ci + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2
                      className={`font-playfair text-3xl font-bold md:text-4xl ${t.head}`}
                    >
                      {c.title}
                    </h2>
                    {c.blurb && (
                      <p className={`mt-1 font-lora italic ${t.dek}`}>
                        {c.blurb}
                      </p>
                    )}
                  </div>
                </header>

                <div className="mt-10 flex flex-col gap-14">
                  {blocks.map((b, bi) => {
                    if (b.kind === "quick") {
                      return (
                        <div
                          key={`q-${bi}`}
                          className="grid gap-4 sm:grid-cols-2"
                        >
                          {b.items.map((q) => (
                            <div
                              key={q.n}
                              className={`border-t-2 p-6 ${t.card} ${
                                b.items.length === 1 ? "sm:col-span-2" : ""
                              }`}
                            >
                              <p
                                className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${t.cardQ}`}
                              >
                                {q.question}
                              </p>
                              <p
                                className={`mt-3 font-playfair text-xl italic leading-snug ${t.cardA}`}
                              >
                                {q.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    const item = b.item;
                    const count = articleCount++;
                    const pull =
                      count % 2 === 0 && item.answer.length > 380
                        ? sentence(item.answer)
                        : null;

                    return (
                      <div key={item.n}>
                        <h3
                          className={`font-playfair text-2xl font-semibold italic leading-snug md:text-3xl ${t.q}`}
                        >
                          {item.question}
                        </h3>

                        <div className="mt-5 lg:columns-2 lg:gap-12">
                          {paragraphs(item.answer).map((p, pi) => (
                            <p
                              key={pi}
                              className={`mb-4 font-lora text-[17px] leading-[1.85] ${
                                t.body
                              } ${
                                bi === firstArticle && pi === 0
                                  ? dropCap(t.cap)
                                  : ""
                              }`}
                            >
                              {p}
                            </p>
                          ))}
                        </div>

                        {pull && (
                          <blockquote
                            className={`mt-8 border-l-4 border-gold pl-6 font-playfair text-2xl italic leading-snug md:text-3xl ${t.pull}`}
                          >
                            “{pull}”
                          </blockquote>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {breakSrc && (
              <PhotoBreak
                src={breakSrc}
                alt={`${profile.name}, photo ${breakIndex + 2}`}
                quote={
                  quotes.length > 0
                    ? quotes[(breakIndex * 5 + 2) % quotes.length]
                    : null
                }
                credit={profile.photo_credit}
              />
            )}
          </div>
        );
      })}

      {/* ---------- Gallery ---------- */}
      {leftover.length > 0 && (
        <section
          className={`py-16 ${lastKind === "cream" ? "bg-white" : "bg-cream"}`}
        >
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
              Gallery
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {leftover.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-[4/5] overflow-hidden bg-purple/20"
                >
                  <Image
                    src={src}
                    alt={`${profile.name}, gallery photo ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover object-top"
                  />
                </div>
              ))}
            </div>
            {profile.photo_credit && (
              <p className="mt-3 text-xs uppercase tracking-widest text-tewa-black/50">
                Photography: {profile.photo_credit}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ---------- Closing quote ---------- */}
      {closingItem && closingText && (
        <section className="bg-purple px-6 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            In their words
          </p>
          <blockquote className="mx-auto mt-6 max-w-4xl font-playfair text-3xl italic leading-snug text-white md:text-5xl">
            “{closingText}”
          </blockquote>
          <p className="mx-auto mt-6 max-w-xl text-xs uppercase tracking-widest text-white/50">
            {profile.name}
          </p>
        </section>
      )}

      {/* ---------- Footer ---------- */}
      <footer className="mx-auto max-w-6xl border-t border-tewa-black/10 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-playfair text-lg italic text-tewa-black/70">
            {profile.name}, featured on TEWA.
          </p>
          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            {profile.social_url && (
              <Link
                href={profile.social_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-purple px-6 py-3 text-white transition-colors hover:bg-gold hover:text-tewa-black"
              >
                Follow {profile.name}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
            <Link
              href="/"
              className="px-4 py-3 text-purple transition-colors hover:text-gold"
            >
              BACK TO TEWA
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
