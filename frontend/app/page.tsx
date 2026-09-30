"use client";

import Link from "next/link";
import { useState } from "react";

type Language = "UZ" | "RU" | "ENG";

const translations = {
  UZ: {
    navFeatures: "Imkoniyatlar",
    navCourses: "Kurslar",
    navLabs: "Lablar",
    login: "Kirish",
    getStarted: "Boshlash",

    badge: "KIBERXAVFSIZLIK TA'LIM PLATFORMASI",
    title: "Kiberxavfsizlikni",
    titleAccent: "o'zlashtiring.",
    description:
      "Tizimli kurslar, amaliy lablar, real challenge'lar va amaliy tajriba orqali kiberxavfsizlikni o'rganing.",

    startLearning: "O'qishni boshlash",
    exploreLabs: "Lablarni ko'rish",

    learningPaths: "O'quv yo'nalishlari",
    lessons: "Amaliy darslar",
    practice: "Amaliy mashg'ulot",
    challenges: "Real challenge'lar",

    learnWay: "O'ZINGIZGA MOS O'RGANING",
    sectionTitle: "Boshlovchidan kiberxavfsizlik mutaxassisigacha.",
    sectionDescription:
      "O'rganish, amaliyot va natijani kuzatishga asoslangan yagona platforma.",

    learn: "O'rganish",
    learnDescription:
      "Fundamental bilimlardan ilg'or mavzulargacha bo'lgan tizimli kiberxavfsizlik kurslari.",

    practiceTitle: "Amaliyot",
    practiceDescription:
      "O'rgangan bilimlaringizni amaliy mashqlar va xavfsiz trening lablarida sinab ko'ring.",

    challenge: "Challenge",
    challengeDescription:
      "Quizlar, challenge'lar va kelajakdagi CTF muhitlari orqali bilimingizni sinang.",

    journey: "SIZNING YO'LINGIZ SHU YERDAN BOSHLANADI",
    ctaTitle: "Haqiqiy kiberxavfsizlik ko'nikmalarini yarating.",
    ctaDescription:
      "O'rganing, challenge'larni bajaring va CyberForge orqali rivojlanishingizni kuzating.",
    createAccount: "Bepul hisob yaratish",

    footer: "O'rganish. Amaliyot. Challenge. Master.",
  },

  RU: {
    navFeatures: "Возможности",
    navCourses: "Курсы",
    navLabs: "Лаборатории",
    login: "Войти",
    getStarted: "Начать",

    badge: "ПЛАТФОРМА ОБУЧЕНИЯ КИБЕРБЕЗОПАСНОСТИ",
    title: "Освойте",
    titleAccent: "кибербезопасность.",
    description:
      "Изучайте кибербезопасность через структурированные курсы, практические лаборатории и реальные задания.",

    startLearning: "Начать обучение",
    exploreLabs: "Открыть лаборатории",

    learningPaths: "Направлений",
    lessons: "Практических уроков",
    practice: "Практика",
    challenges: "Challenge",

    learnWay: "УЧИТЕСЬ ПО-СВОЕМУ",
    sectionTitle: "От новичка до специалиста по кибербезопасности.",
    sectionDescription:
      "Единая среда для обучения, практики и отслеживания прогресса.",

    learn: "Обучение",
    learnDescription:
      "Структурированные курсы по кибербезопасности от основ до продвинутых тем.",

    practiceTitle: "Практика",
    practiceDescription:
      "Применяйте полученные знания в практических заданиях и безопасных учебных лабораториях.",

    challenge: "Challenge",
    challengeDescription:
      "Проверяйте свои знания с помощью квизов, заданий и будущих CTF-сред.",

    journey: "ВАШ ПУТЬ НАЧИНАЕТСЯ ЗДЕСЬ",
    ctaTitle: "Создавайте реальные навыки кибербезопасности.",
    ctaDescription:
      "Учитесь, выполняйте задания и отслеживайте свой прогресс с CyberForge.",
    createAccount: "Создать бесплатный аккаунт",

    footer: "Учись. Практикуйся. Проходи Challenge. Становись мастером.",
  },

  ENG: {
    navFeatures: "Features",
    navCourses: "Courses",
    navLabs: "Labs",
    login: "Login",
    getStarted: "Get Started",

    badge: "CYBERSECURITY EDUCATION PLATFORM",
    title: "Master",
    titleAccent: "Cybersecurity.",
    description:
      "Learn cybersecurity through structured courses, practical labs, real challenges and hands-on experience.",

    startLearning: "Start Learning",
    exploreLabs: "Explore Labs",

    learningPaths: "Learning Paths",
    lessons: "Practical Lessons",
    practice: "Hands-on Practice",
    challenges: "Real Challenges",

    learnWay: "LEARN YOUR WAY",
    sectionTitle: "From beginner to cybersecurity practitioner.",
    sectionDescription:
      "A structured environment designed around learning, practice and measurable progress.",

    learn: "Learn",
    learnDescription:
      "Structured cybersecurity courses covering fundamentals and advanced concepts.",

    practiceTitle: "Practice",
    practiceDescription:
      "Apply what you learn through practical exercises and isolated training labs.",

    challenge: "Challenge",
    challengeDescription:
      "Test your knowledge with quizzes, challenges and future CTF environments.",

    journey: "YOUR JOURNEY STARTS HERE",
    ctaTitle: "Build real cybersecurity skills.",
    ctaDescription:
      "Start learning, complete challenges and track your progress with CyberForge.",
    createAccount: "Create Free Account",

    footer: "Learn. Practice. Challenge. Master.",
  },
};

export default function Home() {
  const [language, setLanguage] = useState<Language>("UZ");
  const t = translations[language];

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070a] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute bottom-[-200px] left-[-100px] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10">
              <span className="text-sm font-bold text-blue-400">
                CF
              </span>
            </div>

            <span className="text-lg font-semibold tracking-tight">
              CyberForge
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <Link href="#features" className="transition hover:text-white">
              {t.navFeatures}
            </Link>

            <Link href="#courses" className="transition hover:text-white">
              {t.navCourses}
            </Link>

            <Link href="#labs" className="transition hover:text-white">
              {t.navLabs}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* LANGUAGE */}
            <div className="hidden items-center rounded-lg border border-white/[0.08] bg-white/[0.03] p-1 sm:flex">
              {(["UZ", "RU", "ENG"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                    language === lang
                      ? "bg-blue-500/15 text-blue-300"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <Link
              href="/login"
              className="hidden text-sm text-zinc-400 transition hover:text-white sm:block"
            >
              {t.login}
            </Link>

            <Link
              href="/register"
              className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 transition hover:border-blue-400/50 hover:bg-blue-500/20"
            >
              {t.getStarted}
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 py-24 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.06] px-3 py-1.5 text-xs text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
              {t.badge}
            </div>

            <h1 className="text-5xl font-bold tracking-[-0.04em] sm:text-6xl lg:text-8xl">
              {t.title}
              <span className="text-blue-400">
                {" "}
                {t.titleAccent}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
              {t.description}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="rounded-xl bg-blue-500 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.2)] transition hover:bg-blue-400"
              >
                {t.startLearning}
              </Link>

              <Link
                href="/labs"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 text-center text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                {t.exploreLabs}
              </Link>
            </div>

            {/* STATS */}
            <div className="mt-16 flex flex-wrap gap-x-12 gap-y-6 border-t border-white/[0.07] pt-8">
              <Stat number="10+" text={t.learningPaths} />
              <Stat number="50+" text={t.lessons} />
              <Stat number="Labs" text={t.practice} />
              <Stat number="CTF" text={t.challenges} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative z-10 border-t border-white/[0.06]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-blue-400">
              {t.learnWay}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.sectionTitle}
            </h2>

            <p className="mt-4 text-zinc-500">
              {t.sectionDescription}
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <FeatureCard
              number="01"
              title={t.learn}
              description={t.learnDescription}
            />

            <FeatureCard
              number="02"
              title={t.practiceTitle}
              description={t.practiceDescription}
            />

            <FeatureCard
              number="03"
              title={t.challenge}
              description={t.challengeDescription}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="courses"
        className="relative z-10 border-t border-white/[0.06]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-8 text-center sm:p-14">
            <p className="text-sm text-blue-400">
              {t.journey}
            </p>

            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              {t.ctaTitle}
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-zinc-500">
              {t.ctaDescription}
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex rounded-xl bg-blue-500 px-7 py-3.5 text-sm font-semibold transition hover:bg-blue-400"
            >
              {t.createAccount}
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 CyberForge</p>
          <p>{t.footer}</p>
        </div>
      </footer>
    </main>
  );
}

function Stat({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div>
      <p className="text-2xl font-semibold">{number}</p>
      <p className="mt-1 text-sm text-zinc-500">{text}</p>
    </div>
  );
}

function FeatureCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 transition duration-300 hover:border-blue-500/20 hover:bg-blue-500/[0.03]">
      <span className="text-xs text-blue-400">{number}</span>

      <h3 className="mt-8 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-zinc-500">
        {description}
      </p>
    </div>
  );
}