"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { getCategories } from "@/lib/api/posts";

type NavLink = { label: string; href: string };

const homeLink: NavLink = { label: "Home", href: "/" };

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavLink[]>([homeLink]);

  useEffect(() => {
    getCategories()
      .then((categories) => {
        setNavItems([
          homeLink,
          ...categories.map((cat) => ({
            label: cat.name,
            href: `/category/${cat.slug}`,
          })),
        ]);
      })
      .catch(() => {
        // On failure, just show Home
        setNavItems([homeLink]);
      });
  }, []);

  return (
    <>
      <header className="border-b border-tewa-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-6">
          <Link href="/">
            <Image
              src="/tewa.png"
              alt="Tewa"
              width={350}
              height={48}
              priority
            />
          </Link>
        </div>

        <div className="border-t border-tewa-black/10">
          <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6">
            <div />

            <nav className="hidden flex-wrap justify-center md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-5 text-sm font-semibold tracking-wide text-tewa-black hover:text-purple transition-colors"
                >
                  {item.label.toUpperCase()}
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-end gap-4 py-5">
              <button
                aria-label="Search"
                onClick={() => setSearchOpen((s) => !s)}
                className="text-tewa-black hover:text-purple transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                aria-label="Menu"
                onClick={() => setMobileOpen((s) => !s)}
                className="text-tewa-black hover:text-purple transition-colors md:hidden"
              >
                {mobileOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="border-t border-tewa-black/10 bg-cream px-6 py-4 animate-slideDown">
              <div className="mx-auto flex max-w-7xl items-center gap-3">
                <Search className="h-4 w-4 text-text-dark/50" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search articles..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-text-dark/40"
                />
              </div>
            </div>
          )}
        </div>

        {mobileOpen && (
          <nav className="flex flex-col border-t border-tewa-black/10 bg-white md:hidden animate-slideDown">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-tewa-black/5 px-6 py-4 text-sm font-semibold tracking-wide text-tewa-black"
              >
                {item.label.toUpperCase()}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
