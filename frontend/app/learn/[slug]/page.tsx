"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Course = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  level: string;
  is_published: boolean;
  is_pro: boolean;
  created_at: string;
};

type Lesson = {
  id: number;
  course_id: number;
  title: string;
  slug: string;
  order: number;
  is_published: boolean;
  created_at: string;
};

const API = "http://127.0.0.1:8000";

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();

  const slug = params.slug as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    async function kursniYuklash() {
      try {
        setLoading(true);
        setError("");

        // 1. Barcha kurslarni olamiz
        const courseResponse = await fetch(`${API}/courses`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (courseResponse.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("cyberforge_user");
          router.replace("/login");
          return;
        }

        if (!courseResponse.ok) {
          throw new Error("Kurslarni yuklashda xatolik");
        }

        const courseData = await courseResponse.json();

        const topilganCourse = (courseData.courses || []).find(
          (item: Course) =>
            String(item.slug).trim().toLowerCase() ===
            String(slug).trim().toLowerCase()
        );

        if (!topilganCourse) {
          setError(`Kurs topilmadi: ${slug}`);
          return;
        }

        setCourse(topilganCourse);

        // 2. Kurs ID orqali lessonlarni olamiz
        const lessonResponse = await fetch(
          `${API}/courses/${topilganCourse.id}/lessons`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (lessonResponse.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("cyberforge_user");
          router.replace("/login");
          return;
        }

        if (!lessonResponse.ok) {
          throw new Error("Darslarni yuklashda xatolik");
        }

        const lessonData = await lessonResponse.json();

        setLessons(lessonData.lessons || []);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Kurs ma'lumotlarini serverdan yuklab bo‘lmadi."
        );
      } finally {
        setLoading(false);
      }
    }

    kursniYuklash();
  }, [router, slug]);

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("cyberforge_user");

    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070a] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />

          <p className="text-sm text-gray-400">
            Kurs yuklanmoqda...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="text-left"
          >
            <h1 className="text-xl font-bold tracking-tight">
              Cyber<span className="text-blue-500">Forge</span>
            </h1>

            <p className="text-xs text-gray-500">
              Cybersecurity Learning Platform
            </p>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-blue-500/40 hover:text-blue-400"
            >
              Profil
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-red-500/40 hover:text-red-400"
            >
              Chiqish
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <h2 className="text-xl font-semibold text-red-400">
              Xatolik
            </h2>

            <p className="mt-3 text-sm text-gray-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => router.push("/learn")}
              className="mt-6 rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20"
            >
              Kurslarga qaytish
            </button>
          </div>
        ) : (
          <>
            {/* COURSE HEADER */}
            <div className="mb-10">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                  {course?.level}
                </span>

                {course?.is_pro ? (
                  <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
                    PRO
                  </span>
                ) : (
                  <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                    FREE
                  </span>
                )}
              </div>

              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                {course?.title}
              </h2>

              <p className="mt-5 max-w-3xl text-base leading-7 text-gray-400">
                {course?.description ||
                  "Ushbu kurs orqali kiberxavfsizlik asoslarini o‘rganing."}
              </p>

              <div className="mt-7 flex flex-wrap gap-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3">
                  <p className="text-xs text-gray-500">
                    Darslar
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {lessons.length}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3">
                  <p className="text-xs text-gray-500">
                    Course ID
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    #{course?.id}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3">
                  <p className="text-xs text-gray-500">
                    Holat
                  </p>

                  <p className="mt-1 text-lg font-semibold text-green-400">
                    Published
                  </p>
                </div>
              </div>
            </div>

            {/* LESSONS */}
            <div>
              <div className="mb-5">
                <p className="text-sm text-blue-400">
                  Course content
                </p>

                <h3 className="mt-1 text-2xl font-bold">
                  Darslar
                </h3>
              </div>

              {lessons.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
                  <h4 className="text-xl font-semibold">
                    Hali darslar mavjud emas
                  </h4>

                  <p className="mt-2 text-sm text-gray-500">
                    Admin panel orqali dars qo‘shing.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lessons.map((lesson) => (
                    <article
                      key={lesson.id}
                      className="group flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition hover:border-blue-500/40 hover:bg-white/[0.05] md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-center gap-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-sm font-bold text-blue-400">
                          {String(lesson.order).padStart(2, "0")}
                        </div>

                        <div>
                          <p className="text-xs text-gray-600">
                            Lesson #{lesson.id}
                          </p>

                          <h4 className="mt-1 text-lg font-semibold transition group-hover:text-blue-400">
                            {lesson.title}
                          </h4>

                          <p className="mt-1 text-xs text-gray-500">
                            {lesson.slug}
                          </p>
                        </div>
                      </div>

                      {/* BOSHLASH */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!course) return;

                          const url = `/lesson/${course.slug}/${lesson.slug}`;

                          console.log("LESSON URL:", url);

                          router.push(url);
                        }}
                        className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20"
                      >
                        Boshlash →
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}