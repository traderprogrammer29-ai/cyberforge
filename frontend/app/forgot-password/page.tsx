
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const API = "http://localhost:8000";

const translations = {
  uz: {
    title: "Parolni tiklash",
    description:
      "Email manzilingizni kiriting. Parolni tiklash havolasini emailingizga yuboramiz.",
    email: "Email manzil",
    emailPlaceholder: "example@gmail.com",
    button: "Tiklash havolasini yuborish",
    back: "Login sahifasiga qaytish",
    success:
      "Agar bu email mavjud bo'lsa, parolni tiklash havolasi yuborildi.",
    error: "Xatolik yuz berdi. Qayta urinib ko'ring.",
    sending: "Yuborilmoqda...",
  },
  ru: {
    title: "Восстановление пароля",
    description:
      "Введите ваш email. Мы отправим ссылку для восстановления пароля.",
    email: "Email адрес",
    emailPlaceholder: "example@gmail.com",
    button: "Отправить ссылку",
    back: "Вернуться к входу",
    success:
      "Если такой email существует, ссылка для восстановления пароля отправлена.",
    error: "Произошла ошибка. Попробуйте снова.",
    sending: "Отправка...",
  },
  eng: {
    title: "Reset Password",
    description:
      "Enter your email address. We will send you a password reset link.",
    email: "Email address",
    emailPlaceholder: "example@gmail.com",
    button: "Send reset link",
    back: "Back to login",
    success:
      "If this email exists, a password reset link has been sent.",
    error: "Something went wrong. Please try again.",
    sending: "Sending...",
  },
};

type Language = keyof typeof translations;

export default function ForgotPasswordPage() {
  const [language, setLanguage] = useState<Language>("uz");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = translations[language];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || t.error);
      }

      setMessage(data.message || t.success);
      setEmail("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-4 py-10 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[140px]" />

      <div className="absolute right-6 top-6 flex gap-2">
        {(["uz", "ru", "eng"] as Language[]).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            className={`rounded-lg border px-3 py-1.5 text-xs transition ${
              language === lang
                ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-[#07101f]/90 p-8 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-xl font-bold text-blue-400 shadow-lg shadow-blue-500/10">
              C
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              {t.title}
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              {t.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                {t.email}
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {message && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm leading-5 text-green-400">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? t.sending : t.button}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-400 transition hover:text-blue-400"
            >
              ← {t.back}
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          CyberForge Security Platform
        </p>
      </div>
    </main>
  );
}