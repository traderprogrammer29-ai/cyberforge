
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API = "http://localhost:8000";

const translations = {
  uz: {
    title: "Yangi parol",
    description: "Akkauntingiz uchun yangi parol o'rnating.",
    password: "Yangi parol",
    confirmPassword: "Parolni tasdiqlang",
    passwordPlaceholder: "Kamida 8 ta belgi",
    confirmPlaceholder: "Parolni qayta kiriting",
    button: "Parolni yangilash",
    updating: "Yangilanmoqda...",
    back: "Login sahifasiga qaytish",
    success: "Parol muvaffaqiyatli yangilandi.",
    mismatch: "Parollar bir xil emas.",
    error: "Xatolik yuz berdi. Qayta urinib ko'ring.",
  },
  ru: {
    title: "Новый пароль",
    description: "Установите новый пароль для вашего аккаунта.",
    password: "Новый пароль",
    confirmPassword: "Подтвердите пароль",
    passwordPlaceholder: "Минимум 8 символов",
    confirmPlaceholder: "Введите пароль повторно",
    button: "Обновить пароль",
    updating: "Обновление...",
    back: "Вернуться к входу",
    success: "Пароль успешно обновлён.",
    mismatch: "Пароли не совпадают.",
    error: "Произошла ошибка. Попробуйте снова.",
  },
  eng: {
    title: "New Password",
    description: "Set a new password for your account.",
    password: "New password",
    confirmPassword: "Confirm password",
    passwordPlaceholder: "At least 8 characters",
    confirmPlaceholder: "Enter your password again",
    button: "Update password",
    updating: "Updating...",
    back: "Back to login",
    success: "Password updated successfully.",
    mismatch: "Passwords do not match.",
    error: "Something went wrong. Please try again.",
  },
};

type Language = keyof typeof translations;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [language, setLanguage] = useState<Language>("uz");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = translations[language];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("Reset token topilmadi.");
      return;
    }

    if (password !== confirmPassword) {
      setError(t.mismatch);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || t.error);
      }

      setMessage(data.message || t.success);
      setPassword("");
      setConfirmPassword("");
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

          {!token ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
              Reset token topilmadi.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.password}
                </label>

                <input
                  type="password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t.confirmPassword}
                </label>

                <input
                  type="password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder={t.confirmPlaceholder}
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
                {loading ? t.updating : t.button}
              </button>
            </form>
          )}

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