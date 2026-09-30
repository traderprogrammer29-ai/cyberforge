"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

const API = "http://127.0.0.1:8000";

export default function LearnPage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    async function kurslarniYuklash() {
      try {
        const response = await fetch(`${API}/courses`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("cyberforge_user");
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Kurslarni yuklashda xatolik");
        }

        const data = await response.json();

        setCourses(data.courses || []);
      } catch (err) {
        console.error(err);
        setError("Kurslarni serverdan yuklab bo‘lmadi.");
      } finally {
        setLoading(false);
      }
    }

    kurslarniYuklash();
  }, [router]);

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("cyberforge_user");
    router.replace("/login");
  }

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchMatch =
        course.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (course.description || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const levelMatch =
        levelFilter === "all" ||
        course.level.toLowerCase() === levelFilter;

      return searchMatch && levelMatch;
    });
  }, [courses, search, levelFilter]);

  const totalCourses = courses.length;

  const proCourses = courses.filter(
    (course) => course.is_pro
  ).length;

  const freeCourses = courses.filter(
    (course) => !course.is_pro
  ).length;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070d] text-white">
        <div className="text-center">

          <div className="relative mx-auto mb-5 h-12 w-12">

            <div className="absolute inset-0 rounded-full border border-blue-500/20" />

            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-blue-500" />

          </div>

          <p className="text-sm text-gray-400">
            Kurslar yuklanmoqda...
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070d] text-white">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px]" />

        <div className="absolute right-[-150px] top-[30%] h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[150px]" />

        <div className="absolute bottom-[-200px] left-[30%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[150px]" />

      </div>


      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#05070d]/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-gray-400 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
            >
              ←
            </button>


            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="text-left"
            >

              <h1 className="text-lg font-bold tracking-tight">
                Cyber<span className="text-blue-500">Forge</span>
              </h1>

              <p className="hidden text-[10px] text-gray-600 sm:block">
                CYBERSECURITY LEARNING PLATFORM
              </p>

            </button>

          </div>


          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-gray-300 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
            >
              Profil
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-gray-400 transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
            >
              Chiqish
            </button>

          </div>

        </div>

      </nav>


      {/* CONTENT */}
      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">


        {/* HERO */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-blue-500/10 bg-gradient-to-br from-blue-600/[0.08] via-[#0a0e17] to-cyan-500/[0.03] p-6 md:p-10">

          <div className="absolute right-[-80px] top-[-100px] h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />

          <div className="relative">

            <div className="mb-4 flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />

              <span className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
                CyberForge Learn
              </span>

            </div>


            <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">

              Kiberxavfsizlikni{" "}
              <span className="text-blue-500">
                noldan
              </span>{" "}
              o‘rganing.

            </h2>


            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 md:text-base">

              Fundamental bilimlardan boshlab amaliy
              laboratoriyalar va challenge'larga qadar
              bosqichma-bosqich rivojlaning.

            </p>

          </div>

        </div>


        {/* STATS */}
        <div className="mb-8 grid grid-cols-3 gap-3 md:gap-4">

          <div className="rounded-2xl border border-white/[0.07] bg-[#0a0e17] p-4 md:p-5">

            <p className="text-xs text-gray-600">
              Barcha kurslar
            </p>

            <p className="mt-2 text-2xl font-bold md:text-3xl">
              {totalCourses}
            </p>

          </div>


          <div className="rounded-2xl border border-white/[0.07] bg-[#0a0e17] p-4 md:p-5">

            <p className="text-xs text-gray-600">
              Free
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-400 md:text-3xl">
              {freeCourses}
            </p>

          </div>


          <div className="rounded-2xl border border-white/[0.07] bg-[#0a0e17] p-4 md:p-5">

            <p className="text-xs text-gray-600">
              PRO
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan-400 md:text-3xl">
              {proCourses}
            </p>

          </div>

        </div>


        {/* SEARCH + FILTER */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row">

          <div className="relative flex-1">

            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
              /
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Kurs qidirish..."
              className="w-full rounded-xl border border-white/[0.08] bg-[#0a0e17] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-blue-500/40"
            />

          </div>


          <select
            value={levelFilter}
            onChange={(event) =>
              setLevelFilter(event.target.value)
            }
            className="rounded-xl border border-white/[0.08] bg-[#0a0e17] px-4 py-3 text-sm text-gray-300 outline-none focus:border-blue-500/40"
          >

            <option value="all">
              Barcha darajalar
            </option>

            <option value="beginner">
              Beginner
            </option>

            <option value="intermediate">
              Intermediate
            </option>

            <option value="advanced">
              Advanced
            </option>

          </select>

        </div>


        {/* ERROR */}
        {error && (

          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-400">
            {error}
          </div>

        )}


        {/* EMPTY */}
        {!error && courses.length === 0 && (

          <div className="rounded-3xl border border-white/[0.08] bg-[#0a0e17] p-12 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/5 text-2xl text-blue-400">
              —
            </div>

            <h3 className="text-xl font-semibold">
              Hozircha kurslar mavjud emas
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Admin panel orqali kurs yarating va
              Published holatiga o'tkazing.
            </p>

          </div>

        )}


        {/* NO SEARCH RESULT */}
        {courses.length > 0 &&
          filteredCourses.length === 0 && (

            <div className="rounded-3xl border border-white/[0.08] bg-[#0a0e17] p-12 text-center">

              <h3 className="text-xl font-semibold">
                Kurs topilmadi
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Qidiruv yoki filter qiymatini o‘zgartirib ko‘ring.
              </p>

            </div>

          )}


        {/* COURSE GRID */}
        {filteredCourses.length > 0 && (

          <div>

            <div className="mb-5 flex items-end justify-between">

              <div>

                <p className="text-xs uppercase tracking-widest text-blue-400">
                  Courses
                </p>

                <h3 className="mt-1 text-2xl font-bold">
                  Kurslar
                </h3>

              </div>

              <p className="text-xs text-gray-600">
                {filteredCourses.length} ta kurs
              </p>

            </div>


            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {filteredCourses.map((course) => (

                <article
                  key={course.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0e17] transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_15px_50px_rgba(37,99,235,0.08)]"
                >

                  {/* top glow */}
                  <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 transition group-hover:opacity-100" />


                  <div className="p-6">


                    {/* COURSE ICON */}
                    <div className="mb-6 flex items-center justify-between">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/5 text-xl font-bold text-blue-400">
                        {course.title.charAt(0).toUpperCase()}
                      </div>


                      <div className="flex items-center gap-2">

                        <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-wider text-gray-500">
                          {course.level}
                        </span>

                        {course.is_pro && (

                          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-cyan-400">
                            PRO
                          </span>

                        )}

                      </div>

                    </div>


                    {/* TITLE */}
                    <h4 className="text-xl font-bold leading-tight transition group-hover:text-blue-400">
                      {course.title}
                    </h4>


                    {/* DESCRIPTION */}
                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-500">
                      {course.description ||
                        "CyberForge kursi haqida ma'lumot."}
                    </p>


                    {/* COURSE INFO */}
                    <div className="mt-6 flex items-center gap-4 border-t border-white/[0.06] pt-5">

                      <div>

                        <p className="text-[10px] uppercase tracking-wider text-gray-700">
                          Kurs
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          #{course.id}
                        </p>

                      </div>


                      <div className="h-7 w-px bg-white/[0.06]" />


                      <div className="flex-1">

                        <p className="text-[10px] uppercase tracking-wider text-gray-700">
                          Status
                        </p>

                        <p className="mt-1 flex items-center gap-2 text-xs text-green-400">

                          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

                          Published

                        </p>

                      </div>

                    </div>


                    {/* BUTTON */}
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/learn/${course.slug}`
                        )
                      }
                      className="mt-5 flex w-full items-center justify-between rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm font-semibold text-blue-400 transition hover:border-blue-500/40 hover:bg-blue-500/10"
                    >

                      <span>
                        Kursni boshlash
                      </span>

                      <span className="text-lg transition group-hover:translate-x-1">
                        →
                      </span>

                    </button>

                  </div>

                </article>

              ))}

            </div>

          </div>

        )}

      </section>

    </main>
  );
}