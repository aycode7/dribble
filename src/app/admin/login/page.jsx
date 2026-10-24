"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) throw loginError;

      const { data, error: adminError } =
        await supabase.rpc("is_admin");

      if (adminError) throw adminError;

      if (!data) {
        await supabase.auth.signOut();
        throw new Error("You do not have admin access.");
      }

      router.replace("/admin");
    } catch (err) {
      setError(err.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <form className="login-card" onSubmit={handleLogin}>
        <Link href="/" className="login-brand">
          DRIBBLE<span>.</span>
        </Link>

        <p className="login-label">ADMINISTRATION</p>
        <h1>Welcome back.</h1>
        <p className="login-description">
          Sign in to manage your football newsroom.
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

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <Link href="/admin/forgot-password" className="forgot-link">
        Forgot password?
        </Link>

        {error && <p className="login-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "SIGN IN →"}
        </button>

        <p className="login-footer">
          THE GAME NEVER STOPS.
        </p>
      </form>
    </main>
  );
}

