"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api-client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      setAuth(res.user, res.token);
      router.replace("/admin");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.message === "Request failed"
            ? "Invalid credentials."
            : err.message
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm border border-tewa-black/10 bg-white p-10">
        <h1 className="font-playfair text-2xl font-bold text-tewa-black">
          TEWA <span className="text-gold">Admin</span>
        </h1>
        <p className="mt-2 text-sm text-text-dark/60">
          Sign in to manage your content.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-dark/60">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-tewa-black/15 px-4 py-2.5 text-sm outline-none focus:border-purple"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-dark/60">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-tewa-black/15 px-4 py-2.5 text-sm outline-none focus:border-purple"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-purple py-3 text-sm font-semibold tracking-wider text-white hover:bg-gold hover:text-tewa-black transition-colors disabled:opacity-50"
          >
            {loading ? "SIGNING IN…" : "SIGN IN"}
          </button>
        </form>
      </div>
    </div>
  );
}
