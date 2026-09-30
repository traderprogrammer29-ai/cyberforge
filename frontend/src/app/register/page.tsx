"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Ro'yxatdan o'tishda xatolik yuz berdi");
        return;
      }

      setSuccess(
        "Account muvaffaqiyatli yaratildi. Login sahifasiga o'ting.",
      );

      setUsername("");
      setEmail("");
      setPassword("");
    } catch {
      setError(
        "Server bilan bog'lanib bo'lmadi. Backend ishlayotganini tekshiring.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070a] px-6 py-12 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10">
              <span className="text-sm font-bold text-blue-400">
                CF
              </span>
            </div>

            <span className="text-xl font-semibold">
              CyberForge
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8">
            <p className="text-sm font-medium text-blue-400">
              JOIN CYBERFORGE
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Account yaratish
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Cybersecurity journey'ingizni bugun boshlang.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm text-zinc-300"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="username"
                minLength={3}
                maxLength={50}
                required
                autoComplete="username"
                className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm text-zinc-300"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-zinc-300"
              >
                Parol
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Kamida 8 ta belgi"
                minLength={8}
                maxLength={128}
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
              />

              <p className="mt-2 text-xs text-zinc-600">
                Parol kamida 8 ta belgidan iborat bo'lishi kerak.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-sm text-emerald-400">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.15)] transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Account yaratilmoqda..."
                : "Account yaratish"}
            </button>
          </form>

          <div className="my-7 h-px bg-white/[0.06]" />

          <p className="text-center text-sm text-zinc-500">
            Accountingiz bormi?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Login qilish
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-700">
          CyberForge · Secure Learning Platform
        </p>
      </div>
    </main>
  );
}