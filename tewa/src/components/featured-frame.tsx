"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { FeaturedPerson } from "@/types/api";

// Highest z-index the browser allows
const TOP_Z = "z-[2147483647]";
const SLIDE_INTERVAL = 3000;

export default function FeaturedFrame({ person }: { person: FeaturedPerson }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = person.images.length;

  // Depends on `active`, so clicking a thumbnail restarts the 3s countdown
  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = setTimeout(() => {
      setActive((i) => (i + 1) % count);
    }, SLIDE_INTERVAL);
    return () => clearTimeout(timer);
  }, [active, count, paused]);

  return (
    // isolate keeps the max z-index scoped to this section
    <section className="relative isolate grid grid-cols-1 overflow-hidden border border-tewa-black/10 bg-gradient-to-br from-cream to-white md:grid-cols-[5fr_7fr]">
      {/* Photo: same fixed crop for every image */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-purple/20 md:aspect-auto md:h-[520px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {person.images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === active ? person.name : ""}
            aria-hidden={i !== active}
            fill
            sizes="(min-width: 768px) 42vw, 100vw"
            className={`${TOP_Z} object-cover object-top transition-opacity duration-700 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
            priority={i === 0}
          />
        ))}

        {count > 1 &&
          (count <= 4 ? (
            <div
              className={`${TOP_Z} absolute bottom-4 left-4 flex gap-2 rounded-full bg-black/40 p-2 backdrop-blur-sm`}
            >
              {person.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  aria-label={`Show photo ${i + 1} of ${person.name}`}
                  className={`relative h-11 w-11 overflow-hidden rounded-full bg-purple/30 ring-2 transition-all ${
                    i === active
                      ? "ring-gold"
                      : "ring-white/30 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover object-top"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div
              className={`${TOP_Z} absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-2 backdrop-blur-sm`}
            >
              {person.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  aria-label={`Show photo ${i + 1} of ${person.name}`}
                  className={`h-2 rounded-full transition-all ${
                    i === active
                      ? "w-6 bg-gold"
                      : "w-2 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          ))}
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center gap-6 px-8 py-12 md:px-14 lg:px-20">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
          Featured
        </span>

        <div className="flex flex-col gap-5">
          <h2 className="font-playfair text-4xl font-bold italic leading-tight text-purple md:text-5xl lg:text-6xl">
            {person.name}
          </h2>
          <div className="h-0.5 w-16 bg-gold" />
        </div>

        {person.titles.length > 0 && (
          <ul className="flex flex-col gap-2 border-l-2 border-gold pl-4 text-sm uppercase tracking-widest text-tewa-black/80 md:text-base">
            {person.titles.map((title) => (
              <li key={title}>{title}</li>
            ))}
          </ul>
        )}

        {person.tagline && (
          <p className="max-w-xl leading-relaxed text-tewa-black/75">
            {person.tagline}
          </p>
        )}

        {person.location && (
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-tewa-black/50">
            <MapPin className="h-3.5 w-3.5 text-gold-dark" />
            {person.location}
          </p>
        )}

        <Link
          href={`/featured/${person.slug}`}
          className="mt-1 inline-flex w-fit items-center gap-3 bg-purple px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-tewa-black"
        >
          Meet {person.name}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
