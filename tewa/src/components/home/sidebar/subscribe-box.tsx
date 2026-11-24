"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/api/newsletter";

export default function SubscribeBox() {
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
    <div className="bg-cream p-8">
      <span className="block h-px w-10 bg-gold" />
      <h3 className="mt-3 font-playfair text-lg font-bold text-tewa-black">
        SUBSCRIBE
      </h3>
      <p className="mt-3 text-sm text-text-dark/70">
        Get the recent popular stories straight into your inbox
      </p>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          disabled={status === "loading"}
          className="border border-tewa-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-purple disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-purple py-3 text-sm font-semibold tracking-wider text-white hover:bg-gold hover:text-tewa-black transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "SIGNING UP…" : "SIGN UP"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-xs ${
            status === "success" ? "text-purple" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
