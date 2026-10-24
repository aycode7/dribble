"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        }
      );

      if (error) throw error;

      setMessage(
        "If an account exists for that email, a reset link will be sent."
      );
    } catch (err) {
      setError(err.message || "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-page">
      <form className="forgot-card" onSubmit={handleReset}>
        <Link href="/" className="forgot-brand">
          DRIBBLE<span>.</span>
        </Link>

        <p className="forgot-label">ACCOUNT RECOVERY</p>
        <h1>Forgot your password?</h1>
        <p className="forgot-description">
          Enter your admin email and we'll send you a password reset link.
        </p>

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your admin email"
          autoComplete="email"
          required
        />

        {message && <p className="forgot-success">{message}</p>}
        {error && <p className="forgot-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "SENDING..." : "SEND RESET LINK →"}
        </button>

        <Link href="/admin/login" className="forgot-back">
          ← Back to login
        </Link>
      </form>
    </main>
  );
}
