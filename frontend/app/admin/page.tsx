"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = "http://127.0.0.1:8000";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  xp?: number;
  level?: number;
  created_at?: string;
};

type Course = {
  id: number;
  title: string;
  slug: string;
  description: string;
  level: string;
  is_published: boolean;
  is_pro: boolean;
  created_at?: string;
};

type Plan = "1_month" | "3_month" | "1_year";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const [activeSection, setActiveSection] = useState("Dashboard");

  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [courseError, setCourseError] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // =========================================================
  // PRO OBUNA
  // =========================================================

  const [selectedUsername, setSelectedUsername] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [selectedPlan, setSelectedPlan] =
    useState<Plan>("1_month");

  const [proLoading, setProLoading] = useState(false);
  const [proError, setProError] = useState("");
  const [proMessage, setProMessage] = useState("");

  const planlar = {
    "1_month": {
      nomi: "1 Oy",
      narx: "79 000 so'm",
    },
    "3_month": {
      nomi: "3 Oy",
      narx: "169 000 so'm",
    },
    "1_year": {
      nomi: "1 Yil",
      narx: "599 000 so'm",
    },
  };

  // =========================================================
  // USER SEARCH
  // =========================================================

  const filteredUsers = users.filter((item) => {
    const search = userSearch.trim().toLowerCase();

    if (!search) {
      return true;
    }

    return (
      item.username.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search)
    );
  });

  // =========================================================
  // ADMIN AUTH
  // =========================================================

  useEffect(() => {
    const tekshirish = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(`${API}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("cyberforge_user");
          router.replace("/login");
          return;
        }

        const malumot = await response.json();

        if (malumot.role !== "admin") {
          router.replace("/dashboard");
          return;
        }

        setUser(malumot);
      } catch {
        setError("Server bilan bog'lanib bo'lmadi.");
      } finally {
        setLoading(false);
      }
    };

    tekshirish();
  }, [router]);

  // =========================================================
  // TOKEN
  // =========================================================

  const tokenniOlish = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return null;
    }

    return token;
  };

  // =========================================================
  // COURSES YUKLASH
  // =========================================================

  const kurslarniYuklash = async () => {
    const token = tokenniOlish();

    if (!token) return;

    setCoursesLoading(true);
    setCourseError("");

    try {
      const response = await fetch(`${API}/courses`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("cyberforge_user");
          router.replace("/login");
          return;
        }

        throw new Error("Kurslarni yuklashda xatolik");
      }

      const malumot = await response.json();

      setCourses(malumot.courses || []);
    } catch {
      setCourseError(
        "Kurslarni serverdan yuklab bo'lmadi."
      );
    } finally {
      setCoursesLoading(false);
    }
  };

  // =========================================================
  // USERS YUKLASH
  // =========================================================

  const userlarniYuklash = async () => {
    const token = tokenniOlish();

    if (!token) return;

    setUsersLoading(true);

    try {
      const response = await fetch(
        `${API}/admin/users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("cyberforge_user");
          router.replace("/login");
          return;
        }

        if (response.status === 403) {
          throw new Error("Admin huquqi kerak.");
        }

        throw new Error(
          "Userlarni yuklashda xatolik"
        );
      }

      const malumot = await response.json();

      setUsers(malumot.users || []);
    } catch (xato) {
      console.error(xato);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // =========================================================
  // SECTION O'ZGARISHI
  // =========================================================

  useEffect(() => {
    if (!user) return;

    if (activeSection === "Courses") {
      kurslarniYuklash();
    }

    if (activeSection === "PRO Obuna") {
      userlarniYuklash();
    }

    if (activeSection === "Users") {
      userlarniYuklash();
    }
  }, [activeSection, user]);

  // =========================================================
  // PRO OBUNA FAOLLASHTIRISH
  // =========================================================

  const proObunaniFaollashtirish = async () => {
    const token = tokenniOlish();

    if (!token) return;

    setProError("");
    setProMessage("");

    if (!selectedUsername) {
      setProError("Avval foydalanuvchini tanlang.");
      return;
    }

    setProLoading(true);

    try {
      const response = await fetch(
        `${API}/admin/subscriptions/grant`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: selectedUsername,
            plan: selectedPlan,
          }),
        }
      );

      const malumot = await response.json();

      if (!response.ok) {
        setProError(
          malumot.detail ||
            "PRO obunani faollashtirishda xatolik."
        );
        return;
      }

      setProMessage(
        `${selectedUsername} uchun ${planlar[selectedPlan].nomi} PRO obuna faollashtirildi.`
      );

      setSelectedUsername("");
      setUserSearch("");

      await userlarniYuklash();
    } catch {
      setProError(
        "Server bilan bog'lanib bo'lmadi."
      );
    } finally {
      setProLoading(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("cyberforge_user");

    router.replace("/login");
  };

  // =========================================================
  // COURSE CREATE
  // =========================================================

  const [showCourseForm, setShowCourseForm] =
    useState(false);

  const [courseTitle, setCourseTitle] =
    useState("");
  const [courseSlug, setCourseSlug] =
    useState("");
  const [courseDescription, setCourseDescription] =
    useState("");
  const [courseLevel, setCourseLevel] =
    useState("beginner");
  const [coursePublished, setCoursePublished] =
    useState(true);
  const [coursePro, setCoursePro] =
    useState(false);

  const [courseSaving, setCourseSaving] =
    useState(false);

  const kursYaratish = async () => {
    const token = tokenniOlish();

    if (!token) return;

    if (!courseTitle.trim()) {
      setCourseError("Kurs nomini kiriting.");
      return;
    }

    if (!courseSlug.trim()) {
      setCourseError("Kurs slugini kiriting.");
      return;
    }

    setCourseSaving(true);
    setCourseError("");

    try {
      const response = await fetch(
        `${API}/admin/courses`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: courseTitle,
            slug: courseSlug,
            description: courseDescription,
            level: courseLevel,
            is_published: coursePublished,
            is_pro: coursePro,
          }),
        }
      );

      const malumot = await response.json();

      if (!response.ok) {
        setCourseError(
          malumot.detail ||
            "Kurs yaratishda xatolik."
        );
        return;
      }

      setCourseTitle("");
      setCourseSlug("");
      setCourseDescription("");
      setCourseLevel("beginner");
      setCoursePublished(true);
      setCoursePro(false);
      setShowCourseForm(false);

      await kurslarniYuklash();
    } catch {
      setCourseError(
        "Server bilan bog'lanib bo'lmadi."
      );
    } finally {
      setCourseSaving(false);
    }
  };

  // =========================================================
  // COURSE DELETE
  // =========================================================

  const kursniOchirish = async (
    course: Course
  ) => {
    const token = tokenniOlish();

    if (!token) return;

    const tasdiq = window.confirm(
      `"${course.title}" kursini o'chirishni xohlaysizmi?`
    );

    if (!tasdiq) return;

    try {
      const response = await fetch(
        `${API}/admin/courses/${course.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const malumot = await response.json();

      if (!response.ok) {
        setCourseError(
          malumot.detail ||
            "Kursni o'chirishda xatolik."
        );
        return;
      }

      await kurslarniYuklash();
    } catch {
      setCourseError(
        "Server bilan bog'lanib bo'lmadi."
      );
    }
  };

  // =========================================================
  // COURSE EDIT
  // =========================================================

  const kursniTahrirlash = async (
    course: Course
  ) => {
    const token = tokenniOlish();

    if (!token) return;

    const yangiNomi = window.prompt(
      "Kurs nomi:",
      course.title
    );

    if (yangiNomi === null) return;

    const yangiDescription = window.prompt(
      "Kurs description:",
      course.description
    );

    if (yangiDescription === null) return;

    try {
      const response = await fetch(
        `${API}/admin/courses/${course.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: yangiNomi,
            slug: course.slug,
            description: yangiDescription,
            level: course.level,
            is_published: course.is_published,
            is_pro: course.is_pro,
          }),
        }
      );

      const malumot = await response.json();

      if (!response.ok) {
        setCourseError(
          malumot.detail ||
            "Kursni yangilashda xatolik."
        );
        return;
      }

      await kurslarniYuklash();
    } catch {
      setCourseError(
        "Server bilan bog'lanib bo'lmadi."
      );
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#05070d] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-2xl border border-white/10 bg-[#080b12] px-8 py-6">
            <p className="text-sm text-blue-400">
              CYBERFORGE
            </p>

            <p className="mt-2 text-gray-400">
              Admin panel yuklanmoqda...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="min-h-screen bg-[#05070d] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-2xl border border-red-500/20 bg-[#080b12] p-8">
            <p className="text-red-400">
              {error || "Admin topilmadi."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#080b12] p-6 md:block">
          <div>
            <p className="text-xs tracking-[0.2em] text-blue-400">
              CYBERFORGE
            </p>

            <h1 className="mt-2 text-xl font-bold">
              Admin Panel
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Administrator boshqaruvi
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {[
              "Dashboard",
              "Courses",
              "Lessons",
              "Users",
              "PRO Obuna",
              "Security Logs",
            ].map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => {
                  setActiveSection(section);
                  setProError("");
                  setProMessage("");
                }}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                  activeSection === section
                    ? "border border-blue-500/20 bg-blue-500/10 text-blue-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {section}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mt-10 w-full rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            Logout
          </button>
        </aside>

        {/* MAIN CONTENT */}

        <section className="flex-1">

          {/* HEADER */}

          <header className="flex items-center justify-between border-b border-white/10 bg-[#080b12]/80 px-6 py-5 backdrop-blur-xl md:px-10">
            <div>
              <p className="text-sm text-gray-500">
                CyberForge / Admin
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {activeSection}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">
                  {user.username}
                </p>

                <p className="text-xs text-blue-400">
                  Administrator
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400">
                {user.username
                  .charAt(0)
                  .toUpperCase()}
              </div>
            </div>
          </header>

          {/* CONTENT */}

          <div className="p-6 md:p-10">

            {/* =================================================
                DASHBOARD
            ================================================= */}

            {activeSection === "Dashboard" && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-blue-400">
                    SYSTEM ACCESS GRANTED
                  </p>

                  <h3 className="mt-2 text-3xl font-bold">
                    Xush kelibsiz, {user.username}
                  </h3>

                  <p className="mt-2 text-sm text-gray-400">
                    Siz CyberForge administratorisiz.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  <div className="rounded-2xl border border-white/10 bg-[#080b12] p-5">
                    <p className="text-sm text-gray-500">
                      Users
                    </p>

                    <p className="mt-3 text-3xl font-bold">
                      {users.length || "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#080b12] p-5">
                    <p className="text-sm text-gray-500">
                      Courses
                    </p>

                    <p className="mt-3 text-3xl font-bold">
                      {courses.length || "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#080b12] p-5">
                    <p className="text-sm text-gray-500">
                      Lessons
                    </p>

                    <p className="mt-3 text-3xl font-bold">
                      —
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#080b12] p-5">
                    <p className="text-sm text-gray-500">
                      Security
                    </p>

                    <p className="mt-3 text-3xl font-bold text-green-400">
                      OK
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* =================================================
                COURSES
            ================================================= */}

            {activeSection === "Courses" && (
              <div className="space-y-6">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-blue-400">
                      COURSE MANAGEMENT
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                      Courses
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowCourseForm(
                        !showCourseForm
                      )
                    }
                    className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm text-blue-400 transition hover:bg-blue-500/20"
                  >
                    {showCourseForm
                      ? "Formani yopish"
                      : "+ Yangi kurs"}
                  </button>
                </div>

                {courseError && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                    {courseError}
                  </div>
                )}

                {showCourseForm && (
                  <div className="rounded-2xl border border-white/10 bg-[#080b12] p-6">
                    <h4 className="text-xl font-semibold">
                      Yangi kurs yaratish
                    </h4>

                    <div className="mt-5 grid gap-4">

                      <input
                        value={courseTitle}
                        onChange={(e) =>
                          setCourseTitle(
                            e.target.value
                          )
                        }
                        placeholder="Kurs nomi"
                        className="rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50"
                      />

                      <input
                        value={courseSlug}
                        onChange={(e) =>
                          setCourseSlug(
                            e.target.value
                          )
                        }
                        placeholder="course-slug"
                        className="rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50"
                      />

                      <textarea
                        value={courseDescription}
                        onChange={(e) =>
                          setCourseDescription(
                            e.target.value
                          )
                        }
                        placeholder="Kurs tavsifi"
                        rows={4}
                        className="rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50"
                      />

                      <select
                        value={courseLevel}
                        onChange={(e) =>
                          setCourseLevel(
                            e.target.value
                          )
                        }
                        className="rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 text-sm text-white outline-none"
                      >
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

                      <label className="flex items-center gap-3 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={coursePublished}
                          onChange={(e) =>
                            setCoursePublished(
                              e.target.checked
                            )
                          }
                        />

                        Published
                      </label>

                      <label className="flex items-center gap-3 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={coursePro}
                          onChange={(e) =>
                            setCoursePro(
                              e.target.checked
                            )
                          }
                        />

                        PRO kurs
                      </label>

                      <button
                        type="button"
                        disabled={courseSaving}
                        onClick={kursYaratish}
                        className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm text-blue-400 transition hover:bg-blue-500/20 disabled:opacity-50"
                      >
                        {courseSaving
                          ? "Saqlanmoqda..."
                          : "KURS YARATISH"}
                      </button>

                    </div>
                  </div>
                )}

                <div className="space-y-4">

                  {coursesLoading ? (
                    <div className="rounded-2xl border border-white/10 bg-[#080b12] p-8 text-gray-400">
                      Kurslar yuklanmoqda...
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-[#080b12] p-8 text-gray-400">
                      Hozircha kurslar mavjud emas.
                    </div>
                  ) : (
                    courses.map((course) => (
                      <div
                        key={course.id}
                        className="rounded-2xl border border-white/10 bg-[#080b12] p-6"
                      >
                        <div className="flex flex-col justify-between gap-5 lg:flex-row">

                          <div>
                            <div className="flex flex-wrap items-center gap-2">

                              <h4 className="text-xl font-semibold">
                                {course.title}
                              </h4>

                              {course.is_pro && (
                                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                                  PRO
                                </span>
                              )}

                              {!course.is_published && (
                                <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                                  DRAFT
                                </span>
                              )}

                            </div>

                            <p className="mt-2 text-sm text-gray-500">
                              {course.description}
                            </p>

                            <p className="mt-3 text-xs text-gray-600">
                              ID: {course.id} · Slug:{" "}
                              {course.slug} · Level:{" "}
                              {course.level}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">

                            <button
                              type="button"
                              onClick={() =>
                                kursniTahrirlash(
                                  course
                                )
                              }
                              className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-2.5 text-sm text-blue-400 transition hover:bg-blue-500/10"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                kursniOchirish(
                                  course
                                )
                              }
                              className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
                            >
                              Delete
                            </button>

                          </div>
                        </div>
                      </div>
                    ))
                  )}

                </div>
              </div>
            )}

            {/* =================================================
                USERS
            ================================================= */}

            {activeSection === "Users" && (
              <div className="space-y-6">

                <div>
                  <p className="text-sm text-blue-400">
                    USER MANAGEMENT
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    Users
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    CyberForge foydalanuvchilari.
                  </p>
                </div>

                <div className="space-y-3">

                  {usersLoading ? (
                    <div className="rounded-2xl border border-white/10 bg-[#080b12] p-8 text-gray-400">
                      Userlar yuklanmoqda...
                    </div>
                  ) : users.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-[#080b12] p-8 text-gray-400">
                      Userlar topilmadi.
                    </div>
                  ) : (
                    users.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-white/10 bg-[#080b12] p-5"
                      >
                        <div className="flex flex-col justify-between gap-4 sm:flex-row">

                          <div>
                            <p className="font-semibold">
                              @{item.username}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {item.email}
                            </p>
                          </div>

                          <div className="text-left sm:text-right">

                            <p className="text-xs text-blue-400">
                              {item.role}
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                              ID: {item.id}
                            </p>

                          </div>

                        </div>
                      </div>
                    ))
                  )}

                </div>
              </div>
            )}

            {/* =================================================
                PRO OBUNA
            ================================================= */}

            {activeSection === "PRO Obuna" && (
              <div className="max-w-3xl space-y-6">

                <div>
                  <p className="text-sm text-blue-400">
                    PRO SUBSCRIPTION MANAGEMENT
                  </p>

                  <h3 className="mt-2 text-3xl font-bold">
                    PRO Obuna
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Foydalanuvchini username yoki
                    email orqali qidiring va PRO
                    obunasini faollashtiring.
                  </p>
                </div>

                {/* USERNAME + SEARCH */}

                <div className="rounded-2xl border border-white/10 bg-[#080b12] p-6">

                  <label className="text-sm font-medium text-gray-300">
                    Foydalanuvchi
                  </label>

                  {/* QIDIRUV */}

                  <div className="relative mt-3">

                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(
                          e.target.value
                        );
                        setProError("");
                        setProMessage("");
                      }}
                      placeholder="Username yoki email orqali qidiring..."
                      className="w-full rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 pr-10 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500/50"
                    />

                    {userSearch && (
                      <button
                        type="button"
                        onClick={() =>
                          setUserSearch("")
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-500 transition hover:text-white"
                        aria-label="Qidiruvni tozalash"
                      >
                        ×
                      </button>
                    )}

                  </div>

                  {/* NATIJALAR SONI */}

                  {!usersLoading &&
                    users.length > 0 && (
                      <p className="mt-2 text-xs text-gray-600">
                        {filteredUsers.length} ta user
                        topildi
                      </p>
                    )}

                  {/* USER TANLASH */}

                  <select
                    value={selectedUsername}
                    onChange={(e) => {
                      setSelectedUsername(
                        e.target.value
                      );
                      setProError("");
                      setProMessage("");
                    }}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/50"
                  >
                    <option value="">
                      Foydalanuvchini tanlang
                    </option>

                    {filteredUsers.map((item) => (
                      <option
                        key={item.id}
                        value={item.username}
                      >
                        {item.username} —{" "}
                        {item.email}
                      </option>
                    ))}
                  </select>

                  {usersLoading && (
                    <p className="mt-2 text-xs text-gray-500">
                      Userlar yuklanmoqda...
                    </p>
                  )}

                  {!usersLoading &&
                    users.length > 0 &&
                    filteredUsers.length === 0 && (
                      <p className="mt-2 text-xs text-yellow-400">
                        Bu qidiruv bo‘yicha user
                        topilmadi.
                      </p>
                    )}

                  {!usersLoading &&
                    users.length === 0 && (
                      <p className="mt-2 text-xs text-red-400">
                        Userlar topilmadi.
                      </p>
                    )}

                </div>

                {/* PLAN */}

                <div className="rounded-2xl border border-white/10 bg-[#080b12] p-6">

                  <label className="text-sm font-medium text-gray-300">
                    PRO obuna turi
                  </label>

                  <select
                    value={selectedPlan}
                    onChange={(e) => {
                      setSelectedPlan(
                        e.target.value as Plan
                      );
                      setProError("");
                      setProMessage("");
                    }}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/50"
                  >
                    <option value="1_month">
                      1 Oy — 79 000 so'm
                    </option>

                    <option value="3_month">
                      3 Oy — 169 000 so'm
                    </option>

                    <option value="1_year">
                      1 Yil — 599 000 so'm
                    </option>
                  </select>

                  {/* TANLANGAN PLAN */}

                  <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">

                    <p className="text-xs text-blue-400">
                      TANLANGAN REJA
                    </p>

                    <p className="mt-2 text-xl font-semibold">
                      {planlar[selectedPlan].nomi}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {planlar[selectedPlan].narx}
                    </p>

                  </div>

                </div>

                {/* SELECTED USER */}

                {selectedUsername && (
                  <div className="rounded-2xl border border-white/10 bg-[#080b12] p-6">

                    <p className="text-xs text-gray-500">
                      PRO beriladigan foydalanuvchi
                    </p>

                    <p className="mt-2 text-xl font-semibold text-blue-400">
                      @{selectedUsername}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Reja:{" "}
                      {planlar[selectedPlan].nomi}
                    </p>

                    <p className="text-sm text-gray-500">
                      Narx:{" "}
                      {planlar[selectedPlan].narx}
                    </p>

                  </div>
                )}

                {/* ERROR */}

                {proError && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                    {proError}
                  </div>
                )}

                {/* SUCCESS */}

                {proMessage && (
                  <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-sm text-green-400">
                    {proMessage}
                  </div>
                )}

                {/* BUTTON */}

                <button
                  type="button"
                  disabled={
                    proLoading ||
                    !selectedUsername
                  }
                  onClick={
                    proObunaniFaollashtirish
                  }
                  className="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {proLoading
                    ? "PRO OBUNA FAOLLASHTIRILMOQDA..."
                    : "PRO OBUNANI FAOLLASHTIRISH"}
                </button>

              </div>
            )}

            {/* =================================================
                LESSONS
            ================================================= */}

            {activeSection === "Lessons" && (
              <div className="rounded-2xl border border-white/10 bg-[#080b12] p-8">

                <p className="text-sm text-blue-400">
                  LESSON MANAGEMENT
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Lessons
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Course → Lesson tizimi shu
                  bo'limda boshqariladi.
                </p>

              </div>
            )}

            {/* =================================================
                SECURITY LOGS
            ================================================= */}

            {activeSection === "Security Logs" && (
              <div className="rounded-2xl border border-white/10 bg-[#080b12] p-8">

                <p className="text-sm text-blue-400">
                  SECURITY MONITORING
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Security Logs
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Security log monitoring keyingi
                  bosqichda ulanadi.
                </p>

              </div>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}