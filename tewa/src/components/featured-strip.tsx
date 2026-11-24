"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FeaturedPerson } from "@/types/api";

const SPEED_PX_PER_SEC = 40;
const TOP_Z = "z-[2147483647]";

function Items({ people }: { people: FeaturedPerson[] }) {
  return (
    <>
      {people.map((p) => (
        <Link
          key={p.id}
          href={`/featured/${p.slug}`}
          title={p.name}
          className="group w-40 shrink-0"
        >
          {/* Fixed 160x160 tile: every photo is cropped identically */}
          <div className="relative h-40 w-40 overflow-hidden rounded-2xl bg-purple/20">
            {p.images[0] && (
              <Image
                src={p.images[0]}
                alt={p.name}
                fill
                sizes="160px"
                className={`${TOP_Z} object-cover object-top transition-transform duration-300 group-hover:scale-105`}
              />
            )}
          </div>
          <p className="mt-2 truncate text-center text-xs font-semibold text-tewa-black group-hover:text-purple">
            {p.name}
          </p>
        </Link>
      ))}
    </>
  );
}

export default function FeaturedStrip({
  people,
}: {
  people: FeaturedPerson[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [scrolling, setScrolling] = useState(false);
  const [groupWidth, setGroupWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current || !groupRef.current) return;
      const gw = groupRef.current.offsetWidth;
      setGroupWidth(gw);
      setScrolling(gw > containerRef.current.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [people]);

  if (people.length === 0) return null;

  return (
    // isolate scopes the max z-index to the strip
    <div
      ref={containerRef}
      className="relative isolate overflow-hidden border-x border-b border-tewa-black/10 bg-cream py-5"
    >
      <div
        className="flex w-max hover:[animation-play-state:paused]"
        style={
          scrolling
            ? {
                animation: `featured-marquee ${
                  groupWidth / SPEED_PX_PER_SEC
                }s linear infinite`,
              }
            : undefined
        }
      >
        <div ref={groupRef} className="flex gap-4 px-4">
          <Items people={people} />
        </div>
        {scrolling && (
          <div className="flex gap-4 px-4" aria-hidden>
            <Items people={people} />
          </div>
        )}
      </div>
    </div>
  );
}
