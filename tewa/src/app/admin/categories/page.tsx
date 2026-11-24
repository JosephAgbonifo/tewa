"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  adminListCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "@/lib/api/admin-categories";
import { ApiCategory } from "@/types/api";

export default function CategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState("");

  const loadCategories = () => {
    setLoading(true);
    adminListCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  };

  useEffect(loadCategories, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newName.trim()) return;

    setCreating(true);
    setError("");
    try {
      const category = await adminCreateCategory(token, newName.trim());
      setCategories((prev) => [...prev, category]);
      setNewName("");
    } catch {
      setError("Failed to create category — it may already exist.");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (category: ApiCategory) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const saveEdit = async (categoryId: number) => {
    if (!token || !editingName.trim()) return;

    try {
      const updated = await adminUpdateCategory(
        token,
        categoryId,
        editingName.trim()
      );
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryId ? updated : c))
      );
      setEditingId(null);
    } catch {
      setError("Failed to update category.");
    }
  };

  const handleDelete = async (category: ApiCategory) => {
    if (!token) return;
    if (!confirm(`Delete "${category.name}"?`)) return;

    try {
      await adminDeleteCategory(token, category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
    } catch {
      alert("Cannot delete — this category still has posts assigned to it.");
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-playfair text-2xl font-bold text-tewa-black">
        Categories
      </h1>
      <p className="mt-1 text-sm text-text-dark/60">
        Manage the categories posts can be published under.
      </p>

      <form onSubmit={handleCreate} className="mt-8 flex gap-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          className="flex-1 border border-tewa-black/15 px-4 py-2.5 text-sm outline-none focus:border-purple"
        />
        <button
          type="submit"
          disabled={creating}
          className="bg-purple px-6 py-2.5 text-sm font-semibold text-white hover:bg-gold hover:text-tewa-black transition-colors disabled:opacity-50"
        >
          {creating ? "ADDING…" : "ADD"}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-8 flex flex-col divide-y divide-tewa-black/10 border-y border-tewa-black/10">
        {loading ? (
          <p className="py-6 text-sm text-text-dark/50">Loading…</p>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between py-3"
            >
              {editingId === category.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  autoFocus
                  className="flex-1 border border-purple px-3 py-1.5 text-sm outline-none"
                />
              ) : (
                <div>
                  <p className="font-medium text-tewa-black">{category.name}</p>
                  <p className="text-xs text-text-dark/50">
                    {category.posts_count ?? 0} posts
                  </p>
                </div>
              )}

              <div className="flex gap-4 text-sm font-semibold">
                {editingId === category.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(category.id)}
                      className="text-purple hover:text-gold transition-colors"
                    >
                      SAVE
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-text-dark/50 hover:text-tewa-black transition-colors"
                    >
                      CANCEL
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(category)}
                      className="text-purple hover:text-gold transition-colors"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      DELETE
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
