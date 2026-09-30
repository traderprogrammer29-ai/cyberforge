"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login amalga oshmadi");
        return;
      }

      localStorage.setItem("access_token", data.access_token);

      window.location.href = "/dashboard";
    } catch {
      setError(
        "Server bilan bog'lanib bo'lmadi. Backend ishlayotganini tekshiring.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070a] px-6 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
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

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8">
            <p className="text-sm font-medium text-blue-400">
              WELCOME BACK
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Accountga kirish
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Cybersecurity journey'ingizni davom ettiring.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
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
                required
                autoComplete="username"
                className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm text-zinc-300"
                >
                  Parol
                </label>

                <span className="text-xs text-zinc-600">
                  Secure Login
                </span>
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.15)] transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Kirilmoqda..." : "Kirish"}
            </button>
          </form>

          <div className="my-7 h-px bg-white/[0.06]" />

          <p className="text-center text-sm text-zinc-500">
            Hali account yo'qmi?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Ro'yxatdan o'tish
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