"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function HeaderBar() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Business", href: "/business" },
    { name: "Events", href: "/events" },
    { name: "International", href: "/business" },
    { name: "Livestyle", href: "/business" },
    { name: "Money", href: "/business" },
    { name: "Innovations", href: "/business" },
    { name: "Subscribe", href: "/business" },
  ];

  return (
    <div className="pt-20">

      {/* DESKTOP MENU */}
      <div className="px-10 gap-4 py-3 text-sm bg-tewa-black text-white font-inter items-center justify-center hidden md:flex">
        {links.map((l) => (
          <Link key={l.name} href={l.href} className="hover:text-gold">
            {l.name}
          </Link>
        ))}
      </div>

      {/* MOBILE HEADER */}
      <div className="bg-tewa-black text-white px-6 py-3 flex items-center justify-between md:hidden">
        

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {open && (
        <div className="md:hidden bg-tewa-black text-white flex flex-col px-6 py-4 space-y-3 font-inter animate-slideDown">
          {links.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className="py-2 border-b border-white/10"
              onClick={() => setOpen(false)}
            >
              {l.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
