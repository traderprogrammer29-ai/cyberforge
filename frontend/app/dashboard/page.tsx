"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  xp: number;
  level: number;
};

type Course = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  level: string;
  is_pro: boolean;
  total_lessons: number;
  completed_lessons: number;
  progress: number;
};

type DashboardData = {
  status: string;
  user: User;
  courses: Course[];
};

type Activity = {
  title: string;
  description: string;
  xp: number;
  type: "lesson" | "quiz" | "lab";
};

type Achievement = {
  name: string;
  description: string;
  unlocked: boolean;
};

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    fetch("http://localhost:8000/dashboard", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Dashboard ma'lumotlarini olishda xato");
        }

        return response.json();
      })
      .then((data: DashboardData) => {
        setDashboard(data);
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("cyberforge_user");
        router.replace("/login");
      });
  }, [router]);

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("cyberforge_user");
    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />

          <p className="text-sm text-gray-400">
            CyberForge yuklanmoqda...
          </p>
        </div>
      </main>
    );
  }

  if (!user || !dashboard) {
    return null;
  }

  const courses = dashboard.courses;

  const currentCourse =
    courses.find((course) => course.progress < 100) ??
    courses[0] ??
    null;

  const xpPerLevel = 500;

  const currentLevelXp = user.xp % xpPerLevel;

  const xpProgress = Math.min(
    100,
    Math.round((currentLevelXp / xpPerLevel) * 100)
  );

  const activities: Activity[] = [
    {
      title: "Lesson tugatildi",
      description: "Kiberxavfsizlik nima?",
      xp: 20,
      type: "lesson",
    },
  ];

  const achievements: Achievement[] = [
    {
      name: "First Step",
      description: "Birinchi lessonni tugating",
      unlocked: user.xp >= 20,
    },
    {
      name: "Network Beginner",
      description: "Networking kursini boshlang",
      unlocked: false,
    },
    {
      name: "Quiz Master",
      description: "10 ta quizni muvaffaqiyatli yakunlang",
      unlocked: false,
    },
    {
      name: "Lab Hunter",
      description: "Birinchi labni bajaring",
      unlocked: false,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-600/[0.06] blur-[160px]" />

        <div className="absolute left-[-200px] top-[40%] h-[450px] w-[450px] rounded-full bg-blue-500/[0.035] blur-[140px]" />

        <div className="absolute right-[-200px] top-[60%] h-[450px] w-[450px] rounded-full bg-blue-500/[0.035] blur-[140px]" />
      </div>

      {/* NAVBAR */}

      <nav className="relative z-20 border-b border-white/[0.06] bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="text-left"
          >
            <h1 className="text-xl font-bold tracking-tight">
              Cyber<span className="text-blue-500">Forge</span>
            </h1>

            <p className="text-xs text-gray-600">
              Cybersecurity Learning Platform
            </p>
          </button>

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="hidden text-sm text-gray-400 transition hover:text-white md:block"
            >
              {user.username}
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-sm text-gray-400 transition hover:border-red-500/30 hover:bg-red-500/[0.05] hover:text-red-400"
            >
              Chiqish
            </button>

          </div>
        </div>
      </nav>

      {/* MAIN */}

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">

        {/* WELCOME */}

        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">
            Dashboard
          </p>

          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Salom, {user.username}
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            Cybersecurity o‘rganishni davom ettiring.
          </p>
        </div>

        {/* TOP STATS */}

        <div className="grid gap-5 md:grid-cols-3">

          {/* XP */}

          <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl transition hover:border-blue-400/20 hover:bg-blue-500/[0.025]">

            <div className="flex items-center justify-between">

              <p className="text-sm text-gray-500">
                XP
              </p>

              <span className="rounded-lg bg-blue-500/10 px-2 py-1 text-[10px] font-semibold text-blue-400">
                XP
              </span>

            </div>

            <p className="mt-4 text-3xl font-semibold text-blue-400">
              {user.xp}
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Tajriba ballari
            </p>

          </div>

          {/* LEVEL */}

          <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl transition hover:border-blue-400/20 hover:bg-blue-500/[0.025]">

            <div className="flex items-center justify-between">

              <p className="text-sm text-gray-500">
                Level
              </p>

              <span className="rounded-lg bg-blue-500/10 px-2 py-1 text-[10px] font-semibold text-blue-400">
                LVL
              </span>

            </div>

            <p className="mt-4 text-3xl font-semibold">
              {user.level}
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Hozirgi darajangiz
            </p>

          </div>

          {/* ROLE */}

          <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl transition hover:border-blue-400/20 hover:bg-blue-500/[0.025]">

            <div className="flex items-center justify-between">

              <p className="text-sm text-gray-500">
                Account
              </p>

              <span className="rounded-lg bg-blue-500/10 px-2 py-1 text-[10px] font-semibold text-blue-400">
                USER
              </span>

            </div>

            <p className="mt-4 text-3xl font-semibold capitalize text-blue-400">
              {user.role}
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Hisob turi
            </p>

          </div>

        </div>

        {/* XP PROGRESS */}

        <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-300">
                Level {user.level} progress
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Keyingi levelgacha XP yig‘ing
              </p>
            </div>

            <p className="text-sm font-medium text-blue-400">
              {currentLevelXp} / {xpPerLevel} XP
            </p>

          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.05]">

            <div
              className="h-full rounded-full bg-blue-500 shadow-[0_0_18px_rgba(59,130,246,0.55)] transition-all duration-700"
              style={{
                width: `${xpProgress}%`,
              }}
            />

          </div>

          <p className="mt-3 text-xs text-gray-600">
            {xpProgress}% yakunlandi
          </p>

        </div>

        {/* CONTINUE LEARNING */}

        {currentCourse && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500/[0.08] to-white/[0.02] p-7 backdrop-blur-xl">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex-1">

                <div className="mb-4 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-blue-300">
                  DAVOM ETING
                </div>

                <h3 className="text-2xl font-semibold tracking-tight">
                  {currentCourse.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {currentCourse.description}
                </p>

                <div className="mt-5 max-w-xl">

                  <div className="mb-2 flex items-center justify-between text-xs">

                    <span className="text-gray-600">
                      Progress
                    </span>

                    <span className="text-blue-400">
                      {currentCourse.progress}%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">

                    <div
                      className="h-full rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      style={{
                        width: `${currentCourse.progress}%`,
                      }}
                    />

                  </div>

                  <p className="mt-2 text-xs text-gray-600">
                    {currentCourse.completed_lessons} / {currentCourse.total_lessons} lesson
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => router.push(`/learn/${currentCourse.slug}`)}
                className="shrink-0 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(37,99,235,0.18)] transition hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.3)]"
              >
                Davom etish →
              </button>

            </div>

          </div>
        )}

        {/* COURSES */}

        <div className="mt-10">

          <div className="mb-5 flex items-end justify-between">

            <div>

              <h3 className="text-xl font-semibold">
                Kurslarim
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                O‘rganayotgan kurslaringiz
              </p>

            </div>

            <button
              type="button"
              onClick={() => router.push("/learn")}
              className="text-sm text-blue-400 transition hover:text-blue-300"
            >
              Barchasi →
            </button>

          </div>

          {courses.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8 text-center">
              <p className="text-sm text-gray-500">
                Hozircha kurslar mavjud emas.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">

              {courses.map((course) => (

                <div
                  key={course.id}
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-400/20 hover:bg-blue-500/[0.025]"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h4 className="font-medium text-gray-200">
                        {course.title}
                      </h4>

                      <p className="mt-1 text-xs text-gray-600">
                        {course.description}
                      </p>

                    </div>

                    <span className="shrink-0 text-sm font-medium text-blue-400">
                      {course.progress}%
                    </span>

                  </div>

                  <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">

                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${course.progress}%`,
                      }}
                    />

                  </div>

                  <div className="mt-3 flex items-center justify-between">

                    <p className="text-xs text-gray-600">
                      {course.completed_lessons} / {course.total_lessons} lesson
                    </p>

                    <button
                      type="button"
                      onClick={() => router.push(`/learn/${course.slug}`)}
                      className="text-xs text-gray-500 transition hover:text-blue-400"
                    >
                      Ochish →
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* ACTIVITY + ACHIEVEMENTS */}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">

          {/* ACTIVITY */}

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl">

            <div className="mb-6">

              <h3 className="text-xl font-semibold">
                Oxirgi faoliyat
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                So‘nggi natijalaringiz
              </p>

            </div>

            <div className="space-y-5">

              {activities.map((activity) => (

                <div
                  key={`${activity.title}-${activity.description}`}
                  className="flex items-center gap-4"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.06] text-blue-400">
                    ✓
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-medium text-gray-300">
                      {activity.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-600">
                      {activity.description}
                    </p>

                  </div>

                  <span className="shrink-0 text-xs font-medium text-blue-400">
                    +{activity.xp} XP
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* ACHIEVEMENTS */}

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl">

            <div className="mb-6">

              <h3 className="text-xl font-semibold">
                Achievements
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Yutuqlaringiz
              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {achievements.map((achievement) => (

                <div
                  key={achievement.name}
                  className={`rounded-xl border p-4 ${
                    achievement.unlocked
                      ? "border-blue-400/15 bg-blue-500/[0.04]"
                      : "border-white/[0.06] bg-white/[0.015] opacity-60"
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        achievement.unlocked
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-white/[0.04] text-gray-600"
                      }`}
                    >
                      {achievement.unlocked ? "✓" : "?"}
                    </div>

                    <div>

                      <p className="text-sm font-medium text-gray-300">
                        {achievement.name}
                      </p>

                      <p className="mt-1 text-[11px] leading-4 text-gray-600">
                        {achievement.description}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="mt-10">

          <h3 className="mb-5 text-xl font-semibold">
            Tezkor kirish
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <button
              type="button"
              onClick={() => router.push("/learn")}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition hover:border-blue-400/20 hover:bg-blue-500/[0.04]"
            >
              <p className="font-medium">
                Learn
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Kurslarni davom ettirish
              </p>
            </button>

            <button
              type="button"
              onClick={() => router.push("/labs")}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition hover:border-blue-400/20 hover:bg-blue-500/[0.04]"
            >
              <p className="font-medium">
                Labs
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Amaliy laboratoriyalar
              </p>
            </button>

            <button
              type="button"
              onClick={() => router.push("/pricing")}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition hover:border-blue-400/20 hover:bg-blue-500/[0.04]"
            >
              <p className="font-medium">
                PRO
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Premium imkoniyatlar
              </p>
            </button>

            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition hover:border-blue-400/20 hover:bg-blue-500/[0.04]"
            >
              <p className="font-medium">
                Profile
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Profilni ko‘rish
              </p>
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}