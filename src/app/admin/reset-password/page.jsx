"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!data.session) {
        throw new Error(
          "Your reset link is invalid or expired. Request a new one."
        );
      }

      const { error: updateError } =
        await supabase.auth.updateUser({ password });

      if (updateError) throw updateError;

      setSuccess(true);

      await supabase.auth.signOut();

      setTimeout(() => {
        router.replace("/admin/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Could not update your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="reset-page">
      <form className="reset-card" onSubmit={handleReset}>
        <Link href="/" className="reset-brand">
          DRIBBLE<span>.</span>
        </Link>

        <p className="reset-label">ACCOUNT RECOVERY</p>
        <h1>Set a new password.</h1>
        <p className="reset-description">
          Choose a new password for your DRIBBLE. admin account.
        </p>

        <label htmlFor="password">New password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
          required
        />

        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Enter your password again"
          autoComplete="new-password"
          minLength={8}
          required
        />

        {error && <p className="reset-error">{error}</p>}

        {success && (
          <p className="reset-success">
            Password updated! Redirecting to login...
          </p>
        )}

        <button type="submit" disabled={loading || success}>
          {loading ? "UPDATING..." : "UPDATE PASSWORD →"}
        </button>

        <Link href="/admin/login" className="reset-back">
          ← Back to login
        </Link>
      </form>
    </main>
  );
}
