"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { logout } from "@/lib/api/auth";
import AdminGuard from "@/components/admin/admin-guard";

const navLinks = [
  { label: "Posts", href: "/admin" },
  { label: "New Post", href: "/admin/posts/new" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Newsletter", href: "/admin/newsletter" },
  { label: "Featured", href: "/admin/featured" },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, clearAuth } = useAuth();

  const handleLogout = async () => {
    if (token) {
      try {
        await logout(token);
      } catch {
        // ignore — clear local state regardless
      }
    }
    clearAuth();
    router.replace("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="flex w-64 flex-col justify-between border-r border-tewa-black/10 bg-tewa-black px-6 py-8">
        <div>
          <Link
            href="/admin"
            className="font-playfair text-xl font-bold text-white"
          >
            TEWA <span className="text-gold">Admin</span>
          </Link>

          <nav className="mt-10 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded px-4 py-2.5 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-purple text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-sm text-white/50">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-3 text-sm font-semibold text-gold hover:text-white transition-colors"
          >
            LOG OUT
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-10">{children}</main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login page renders without the guard/sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
