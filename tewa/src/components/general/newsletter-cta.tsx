"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/api/newsletter";

export default function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const msg = await subscribeToNewsletter(email);
      setMessage(msg);
      setStatus("success");
      setEmail("");
    } catch {
      setMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section className="bg-cream py-16 text-center">
      <h2 className="font-playfair text-3xl font-bold text-tewa-black">
        Stay Updated
      </h2>
      <p className="mt-3 text-text-dark/70">
        Get the recent popular stories straight into your inbox
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-6 flex max-w-md flex-col gap-3 px-6 sm:flex-row sm:px-0"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          disabled={status === "loading"}
          className="flex-1 border border-tewa-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-purple disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-purple px-8 py-3 text-sm font-semibold tracking-wider text-white hover:bg-gold hover:text-tewa-black transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "SIGNING UP…" : "SIGN UP"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-sm ${
            status === "success" ? "text-purple" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </section>
  );
}
