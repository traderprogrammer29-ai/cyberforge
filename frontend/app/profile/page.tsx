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

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const savedImage = localStorage.getItem(
      "cyberforge_profile_image"
    );

    if (savedImage) {
      setProfileImage(savedImage);
    }

    fetch("http://localhost:8000/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return null;
        }

        if (!response.ok) {
          throw new Error(
            "Profil ma'lumotlarini olishda xatolik"
          );
        }

        return response.json();
      })
      .then((data: DashboardData | null) => {
        if (!data) return;

        setUser(data.user);
        setCourses(data.courses);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#05070d] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />

          <p className="text-gray-400 text-sm">
            Profil yuklanmoqda...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const xpPerLevel = 500;

  const currentLevelXP = user.xp % xpPerLevel;

  const xpProgress =
    (currentLevelXP / xpPerLevel) * 100;

  const completedCourses = courses.filter(
    (course) => course.progress === 100
  ).length;

  const totalLessons = courses.reduce(
    (total, course) =>
      total + course.total_lessons,
    0
  );

  const completedLessons = courses.reduce(
    (total, course) =>
      total + course.completed_lessons,
    0
  );

  const averageProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce(
            (total, course) =>
              total + course.progress,
            0
          ) / courses.length
        )
      : 0;

  const initial = user.username
    .charAt(0)
    .toUpperCase();

  const profileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Rasm hajmi 5 MB dan katta bo'lmasligi kerak."
      );

      event.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Faqat JPG, PNG yoki WebP formatdagi rasm tanlang."
      );

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result as string;

      setProfileImage(image);

      localStorage.setItem(
        "cyberforge_profile_image",
        image
      );
    };

    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    setProfileImage(null);

    localStorage.removeItem(
      "cyberforge_profile_image"
    );
  };

  return (
    <main className="min-h-screen bg-[#05070d] text-white">

      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-[-200px] left-[20%] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />

        <div className="absolute bottom-[-200px] right-[10%] w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full" />

      </div>


      {/* CONTENT */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div>

            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-gray-500 hover:text-blue-400 transition mb-3"
            >
              ← Dashboard
            </button>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Profil
            </h1>

            <p className="text-gray-500 mt-2">
              CyberForge hisobingiz va o‘quv statistikangiz
            </p>

          </div>


          <div className="hidden md:flex items-center gap-3">

            <div className="px-4 py-2 rounded-xl border border-blue-500/20 bg-blue-500/5 text-sm text-blue-400">
              Level {user.level}
            </div>

          </div>

        </div>


        {/* PROFILE MAIN CARD */}
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0e17]/90 backdrop-blur-xl mb-6">

          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />

          <div className="relative p-6 md:p-8">

            <div className="flex flex-col md:flex-row md:items-center gap-6">


              {/* PROFILE IMAGE */}
              <div className="relative group">

                <label
                  htmlFor="profile-image"
                  className="block cursor-pointer"
                >

                  <div className="w-28 h-28 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600/30 to-cyan-500/10 border border-blue-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.15)]">

                    {profileImage ? (

                      <img
                        src={profileImage}
                        alt="Profil rasmi"
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <span className="text-5xl font-bold text-blue-400">
                        {initial}
                      </span>

                    )}

                  </div>


                  {/* HOVER */}
                  <div className="absolute inset-0 rounded-3xl bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">

                    <span className="text-xs text-white text-center px-2">
                      Rasmni<br />
                      almashtirish
                    </span>

                  </div>

                </label>


                {/* FILE INPUT */}
                <input
                  id="profile-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={profileImageChange}
                />


                {/* LEVEL */}
                <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-lg bg-[#0a0e17] border border-blue-500/30 text-xs text-blue-400">
                  Lvl {user.level}
                </div>

              </div>


              {/* USER INFO */}
              <div className="flex-1">

                <div className="flex flex-wrap items-center gap-3 mb-2">

                  <h2 className="text-2xl md:text-3xl font-bold">
                    {user.username}
                  </h2>


                  {user.role === "admin" && (

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      ADMIN
                    </span>

                  )}

                </div>


                <p className="text-gray-400 mb-1">
                  {user.email}
                </p>

                <p className="text-sm text-gray-600">
                  CyberForge member
                </p>


                {/* REMOVE PHOTO */}
                {profileImage && (

                  <button
                    onClick={removeProfileImage}
                    className="mt-4 text-xs text-gray-600 hover:text-red-400 transition"
                  >
                    Profil rasmini olib tashlash
                  </button>

                )}

              </div>


              {/* XP */}
              <div className="md:w-72">

                <div className="flex items-center justify-between mb-2">

                  <span className="text-sm text-gray-400">
                    Level {user.level}
                  </span>

                  <span className="text-sm text-blue-400 font-medium">
                    {currentLevelXP} / {xpPerLevel} XP
                  </span>

                </div>


                <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">

                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-700"
                    style={{
                      width: `${xpProgress}%`,
                    }}
                  />

                </div>


                <p className="text-xs text-gray-600 mt-2">
                  Keyingi levelgacha{" "}
                  {xpPerLevel - currentLevelXP} XP
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* STATS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">


          {/* XP */}
          <div className="group rounded-2xl border border-white/[0.08] bg-[#0a0e17] p-5 hover:border-blue-500/30 transition">

            <div className="flex items-center justify-between mb-4">

              <span className="text-gray-500 text-sm">
                Umumiy XP
              </span>

              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center text-blue-400">
                XP
              </div>

            </div>

            <p className="text-3xl font-bold">
              {user.xp}
            </p>

            <p className="text-xs text-gray-600 mt-1">
              tajriba ballari
            </p>

          </div>


          {/* LEVEL */}
          <div className="group rounded-2xl border border-white/[0.08] bg-[#0a0e17] p-5 hover:border-blue-500/30 transition">

            <div className="flex items-center justify-between mb-4">

              <span className="text-gray-500 text-sm">
                Level
              </span>

              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/10 flex items-center justify-center text-cyan-400">
                L
              </div>

            </div>

            <p className="text-3xl font-bold">
              {user.level}
            </p>

            <p className="text-xs text-gray-600 mt-1">
              joriy daraja
            </p>

          </div>


          {/* COURSES */}
          <div className="group rounded-2xl border border-white/[0.08] bg-[#0a0e17] p-5 hover:border-blue-500/30 transition">

            <div className="flex items-center justify-between mb-4">

              <span className="text-gray-500 text-sm">
                Kurslar
              </span>

              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center text-blue-400">
                C
              </div>

            </div>

            <p className="text-3xl font-bold">
              {completedCourses}
            </p>

            <p className="text-xs text-gray-600 mt-1">
              tugatilgan kurslar
            </p>

          </div>


          {/* LESSONS */}
          <div className="group rounded-2xl border border-white/[0.08] bg-[#0a0e17] p-5 hover:border-blue-500/30 transition">

            <div className="flex items-center justify-between mb-4">

              <span className="text-gray-500 text-sm">
                Darslar
              </span>

              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/10 flex items-center justify-center text-cyan-400">
                L
              </div>

            </div>

            <p className="text-3xl font-bold">
              {completedLessons}

              <span className="text-gray-600 text-lg font-normal">
                /{totalLessons}
              </span>

            </p>

            <p className="text-xs text-gray-600 mt-1">
              tugatilgan darslar
            </p>

          </div>

        </section>


        {/* LOWER CONTENT */}
        <div className="grid lg:grid-cols-3 gap-6">


          {/* LEARNING PROGRESS */}
          <section className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-[#0a0e17] overflow-hidden">

            <div className="p-6 border-b border-white/[0.06]">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-semibold">
                    O‘qish jarayoni
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Kurslardagi umumiy progress
                  </p>

                </div>


                <span className="text-2xl font-bold text-blue-400">
                  {averageProgress}%
                </span>

              </div>

            </div>


            <div className="p-6">

              {courses.length === 0 ? (

                <div className="py-12 text-center">

                  <div className="text-4xl mb-4">
                    —
                  </div>

                  <p className="text-gray-400">
                    Hozircha kurs mavjud emas.
                  </p>

                </div>

              ) : (

                <div className="space-y-5">

                  {courses.map((course) => (

                    <div
                      key={course.id}
                      className="group"
                    >

                      <div className="flex items-center justify-between mb-2">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/10 flex items-center justify-center text-blue-400 text-sm">
                            {course.title.charAt(0)}
                          </div>

                          <div>

                            <h4 className="text-sm font-medium text-gray-200">
                              {course.title}
                            </h4>

                            <p className="text-xs text-gray-600">
                              {course.completed_lessons} /{" "}
                              {course.total_lessons} dars
                            </p>

                          </div>

                        </div>


                        <span className="text-sm text-blue-400">
                          {course.progress}%
                        </span>

                      </div>


                      <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">

                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-700"
                          style={{
                            width: `${course.progress}%`,
                          }}
                        />

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </section>


          {/* ACCOUNT */}
          <section className="rounded-2xl border border-white/[0.08] bg-[#0a0e17] overflow-hidden">

            <div className="p-6 border-b border-white/[0.06]">

              <h3 className="text-lg font-semibold">
                Account
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Hisob ma'lumotlari
              </p>

            </div>


            <div className="p-6 space-y-5">


              {/* USERNAME */}
              <div>

                <p className="text-xs text-gray-600 mb-2">
                  Username
                </p>

                <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">

                  <p className="text-sm text-gray-300">
                    {user.username}
                  </p>

                </div>

              </div>


              {/* EMAIL */}
              <div>

                <p className="text-xs text-gray-600 mb-2">
                  Email
                </p>

                <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] break-all">

                  <p className="text-sm text-gray-300">
                    {user.email}
                  </p>

                </div>

              </div>


              {/* ROLE */}
              <div>

                <p className="text-xs text-gray-600 mb-2">
                  Role
                </p>

                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">

                  <p className="text-sm text-gray-300">
                    {user.role}
                  </p>

                  <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />

                </div>

              </div>


              {/* SECURITY */}
              <div className="pt-2">

                <div className="p-4 rounded-xl border border-blue-500/10 bg-blue-500/[0.03]">

                  <div className="flex items-start gap-3">

                    <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      ✓
                    </div>

                    <div>

                      <p className="text-sm font-medium text-gray-200">
                        Account Security
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        JWT authentication faol.
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              {/* BUTTON */}
              <button
                onClick={() => router.push("/learn")}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition shadow-[0_0_25px_rgba(37,99,235,0.15)]"
              >
                O‘qishni davom ettirish
              </button>

            </div>

          </section>

        </div>


        {/* BOTTOM XP */}
        <section className="mt-6 rounded-2xl border border-blue-500/10 bg-gradient-to-r from-blue-600/[0.06] to-cyan-500/[0.03] p-6">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

            <div>

              <p className="text-xs uppercase tracking-widest text-blue-400 mb-2">
                CyberForge Progress
              </p>

              <h3 className="text-xl font-semibold">
                Keyingi bosqichga tayyorlaning
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Har bir dars va test sizga XP olib keladi.
              </p>

            </div>


            <div className="md:w-80">

              <div className="flex justify-between text-xs mb-2">

                <span className="text-gray-500">
                  Level {user.level}
                </span>

                <span className="text-blue-400">
                  {currentLevelXP}/{xpPerLevel} XP
                </span>

              </div>


              <div className="h-2.5 bg-black/30 rounded-full overflow-hidden">

                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                  style={{
                    width: `${xpProgress}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}