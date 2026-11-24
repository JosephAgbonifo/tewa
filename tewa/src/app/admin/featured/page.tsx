"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { adminListFeatured, adminDeleteFeatured } from "@/lib/api/featured";
import { AdminFeatured } from "@/types/api";

const STATUS: Record<string, { label: string; cls: string }> = {
  invited: { label: "INVITED", cls: "bg-tewa-black/10 text-tewa-black/70" },
  draft: { label: "IN PROGRESS", cls: "bg-purple/10 text-purple" },
  submitted: { label: "SUBMITTED", cls: "bg-gold/20 text-gold-dark" },
  preview_sent: { label: "AWAITING THEIR OK", cls: "bg-purple/10 text-purple" },
  confirmed: { label: "CONFIRMED", cls: "bg-green-100 text-green-700" },
  subject_changes: {
    label: "THEY WANT CHANGES",
    cls: "bg-red-100 text-red-700",
  },
  changes_requested: { label: "SENT BACK", cls: "bg-red-100 text-red-700" },
  approved: { label: "LIVE", cls: "bg-green-100 text-green-700" },
};

export default function AdminFeaturedPage() {
  const { token } = useAuth();
  const [people, setPeople] = useState<AdminFeatured[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    adminListFeatured(token)
      .then(setPeople)
      .finally(() => setLoading(false));
  }, [token]);

  const copyLink = async (p: AdminFeatured) => {
    if (!p.interview_url) return;
    await navigator.clipboard.writeText(p.interview_url);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDelete = async (p: AdminFeatured) => {
    if (!token) return;
    if (
      !confirm(`Remove "${p.name}"? This also deletes their uploaded photos.`)
    )
      return;
    setDeletingId(p.id);
    try {
      await adminDeleteFeatured(token, p.id);
      setPeople((prev) => prev.filter((x) => x.id !== p.id));
    } catch {
      alert("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-tewa-black">
            Featured
          </h1>
          <p className="mt-1 text-sm text-text-dark/60">
            Invite people to fill the interview, review their answers, then
            approve. The newest approved person is the current feature.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/featured/new"
            className="border border-purple px-5 py-2.5 text-sm font-semibold text-purple transition-colors hover:bg-purple hover:text-white"
          >
            QUICK ADD
          </Link>
          <Link
            href="/admin/featured/invite"
            className="bg-purple px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-tewa-black"
          >
            + INVITE
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col divide-y divide-tewa-black/10 border-y border-tewa-black/10">
        {loading ? (
          <p className="py-6 text-sm text-text-dark/50">Loading…</p>
        ) : people.length === 0 ? (
          <p className="py-6 text-sm text-text-dark/50">Nobody yet.</p>
        ) : (
          people.map((p) => {
            const status = STATUS[p.status] ?? STATUS.invited;
            return (
              <div key={p.id} className="flex items-center gap-4 py-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-cream">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name ?? ""}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-tewa-black">
                    {p.name}
                    {p.is_current && (
                      <span className="ml-2 bg-gold/20 px-2 py-0.5 text-xs text-gold-dark">
                        CURRENT
                      </span>
                    )}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-dark/50">
                    <span className={`px-2 py-0.5 font-semibold ${status.cls}`}>
                      {status.label}
                    </span>
                    {p.email && <span>{p.email}</span>}
                  </p>
                </div>

                <div className="flex gap-4 text-sm font-semibold">
                  {p.status !== "invited" && (
                    <Link
                      href={`/admin/featured/${p.id}`}
                      className="text-purple transition-colors hover:text-gold"
                    >
                      REVIEW
                    </Link>
                  )}
                  {p.interview_url && p.status !== "approved" && (
                    <button
                      onClick={() => copyLink(p)}
                      className="text-tewa-black/60 transition-colors hover:text-tewa-black"
                    >
                      {copiedId === p.id ? "COPIED" : "COPY LINK"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(p)}
                    disabled={deletingId === p.id}
                    className="text-red-600 transition-colors hover:text-red-800 disabled:opacity-50"
                  >
                    {deletingId === p.id ? "DELETING…" : "DELETE"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
