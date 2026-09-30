
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:8000";

type Language = "UZ" | "RU" | "ENG";

const translations = {
  UZ: {
    secureAccess: "XAVFSIZ KIRISH",
    welcome: "Xush kelibsiz",
    subtitle:
      "Cybersecurity journey'ingizni davom ettirish uchun accountingizga kiring.",
    username: "Username",
    password: "Parol",
    forgotPassword: "Parolni unutdingizmi?",
    protected: "HIMOYALANGAN",
    login: "Kirish",
    loggingIn: "Kirilmoqda...",
    account: "Hali account yo'qmi?",
    register: "Ro'yxatdan o'tish",
    serverError:
      "Server bilan bog'lanib bo'lmadi. Backend ishlayotganini tekshiring.",
    tokenError: "Server token qaytarmadi.",
    userError: "Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi.",
    unexpected: "Kutilmagan xatolik yuz berdi.",
    security: "CyberForge · Secure Learning Platform",
  },

  RU: {
    secureAccess: "БЕЗОПАСНЫЙ ВХОД",
    welcome: "С возвращением",
    subtitle:
      "Войдите в аккаунт, чтобы продолжить обучение кибербезопасности.",
    username: "Имя пользователя",
    password: "Пароль",
    forgotPassword: "Забыли пароль?",
    protected: "ЗАЩИЩЕНО",
    login: "Войти",
    loggingIn: "Вход...",
    account: "Нет аккаунта?",
    register: "Зарегистрироваться",
    serverError:
      "Не удалось подключиться к серверу. Проверьте, работает ли backend.",
    tokenError: "Сервер не вернул токен.",
    userError: "Не удалось получить данные пользователя.",
    unexpected: "Произошла непредвиденная ошибка.",
    security: "CyberForge · Secure Learning Platform",
  },

  ENG: {
    secureAccess: "SECURE ACCESS",
    welcome: "Welcome back",
    subtitle:
      "Sign in to continue your cybersecurity learning journey.",
    username: "Username",
    password: "Password",
    forgotPassword: "Forgot password?",
    protected: "PROTECTED",
    login: "Sign in",
    loggingIn: "Signing in...",
    account: "Don't have an account?",
    register: "Create account",
    serverError:
      "Unable to connect to the server. Check if the backend is running.",
    tokenError: "Server did not return a token.",
    userError: "Unable to get user information.",
    unexpected: "An unexpected error occurred.",
    security: "CyberForge · Secure Learning Platform",
  },
};

export default function LoginPage() {
  const router = useRouter();

  const [language, setLanguage] = useState<Language>("UZ");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const t = translations[language];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      // 1. LOGIN
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || t.unexpected);
      }

      if (!data.access_token) {
        throw new Error(t.tokenError);
      }

      // 2. TOKENNI SAQLASH
      localStorage.setItem("access_token", data.access_token);

      // 3. LOGIN QILGAN USER MA'LUMOTINI OLISH
      const meResponse = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });

      if (!meResponse.ok) {
        localStorage.removeItem("access_token");
        throw new Error(t.userError);
      }

      const me = await meResponse.json();

      // 4. USER MA'LUMOTLARINI SAQLASH
      localStorage.setItem(
        "cyberforge_user",
        JSON.stringify({
          id: me.user_id,
          username: me.username,
          email: me.email,
          role: me.role,
          xp: me.xp,
          level: me.level,
        })
      );

      // 5. ROLE BO'YICHA YO'NALTIＲISH
      if (me.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      if (err instanceof TypeError) {
        setError(t.serverError);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t.unexpected);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[140px]" />

        <div className="absolute bottom-[-200px] left-[-150px] h-[400px] w-[400px] rounded-full bg-blue-600/[0.05] blur-[120px]" />

        <div className="absolute right-[-150px] top-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.04] blur-[120px]" />
      </div>

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Navbar */}
      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/[0.08] shadow-[0_0_25px_rgba(59,130,246,0.08)]">
              <span className="text-sm font-bold tracking-wide text-blue-400">
                CF
              </span>
            </div>

            <div>
              <span className="text-lg font-semibold tracking-tight">
                CyberForge
              </span>

              <span className="ml-2 hidden text-xs text-zinc-600 sm:inline">
                Security Learning
              </span>
            </div>
          </Link>

          {/* Language switcher */}
          <div className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
            {(["UZ", "RU", "ENG"] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  language === lang
                    ? "bg-blue-500/15 text-blue-400"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/[0.07] shadow-[0_0_35px_rgba(59,130,246,0.12)]">
              <svg
                className="h-6 w-6 text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-9V7a4 4 0 00-8 0v3h8z"
                />
              </svg>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              {t.secureAccess}
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.welcome}
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-500">
              {t.subtitle}
            </p>
          </div>

          {/* Card */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  {t.username}
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg
                      className="h-4 w-4 text-zinc-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>

                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="username"
                    required
                    autoComplete="username"
                    spellCheck={false}
                    className="w-full rounded-xl border border-white/[0.08] bg-black/30 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 hover:border-white/[0.12] focus:border-blue-500/50 focus:bg-blue-500/[0.02] focus:ring-4 focus:ring-blue-500/[0.07]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-300"
                  >
                    {t.password}
                  </label>

                  <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                    {t.protected}
                  </span>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/[0.08] bg-black/30 py-3.5 pl-4 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-700 hover:border-white/[0.12] focus:border-blue-500/50 focus:bg-blue-500/[0.02] focus:ring-4 focus:ring-blue-500/[0.07]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-zinc-600 transition hover:text-blue-400"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18M10.6 10.6a2 2 0 102.8 2.8M9.9 4.2A10.8 10.8 0 0112 4c5 0 8.5 4 9.5 6-0.4.9-1.4 2.3-2.8 3.4M6.2 6.2C4.5 7.4 3.4 9 2.5 10c1 2 4.5 6 9.5 6 1.2 0 2.3-.2 3.3-.6"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
                        />
                        <circle cx="12" cy="12" r="2.5" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Forgot password */}
                <div className="mt-2 flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
                  >
                    {t.forgotPassword}
                  </Link>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3.5 text-sm leading-5 text-red-400"
                >
                  {error}
                </div>
              )}

              {/* Login */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.15)] transition hover:bg-blue-400 hover:shadow-[0_0_40px_rgba(59,130,246,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {t.loggingIn}
                    </>
                  ) : (
                    <>
                      {t.login}

                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14m-6-6l6 6-6 6"
                        />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/[0.06]" />

              <span className="text-[10px] uppercase tracking-widest text-zinc-700">
                or
              </span>

              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            {/* Register */}
            <p className="text-center text-sm text-zinc-500">
              {t.account}{" "}
              <Link
                href="/register"
                className="font-medium text-blue-400 transition hover:text-blue-300"
              >
                {t.register}
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-700">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z"
              />
            </svg>

            <span>{t.security}</span>
          </div>
        </div>
      </div>
    </main>
  );
}