"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API = "http://127.0.0.1:8000";

type Lesson = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  order: number;
  is_published: boolean;
};

type Course = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  level: string;
  is_pro: boolean;
};

type QuizQuestion = {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
};

type QuizFeedback = {
  question_id: number;
  user_answer: string;
  correct_answer: string;
  correct: boolean;
  explanation: string;
};

type QuizResult = {
  status: string;
  score: number;
  total: number;
  passed: boolean;
  xp_added: number;
  xp: number;
  feedback: QuizFeedback[];
};

const QUIZ_SAVOLLARI: QuizQuestion[] = [
  {
    id: 1,
    question:
      "Kompaniya serveridagi ma’lumotlar attacker tomonidan o‘zgartirildi, lekin foydalanuvchilar ma’lumotlarni ko‘ra olmoqda. CIA Triadning qaysi prinsipi buzilgan?",
    option_a: "Confidentiality",
    option_b: "Integrity",
    option_c: "Availability",
    option_d: "Authentication",
  },
  {
    id: 2,
    question:
      "Foydalanuvchiga bank nomidan soxta email kelib, login va parolini kiritish uchun havola berildi. Bu qaysi hujum turi?",
    option_a: "DDoS",
    option_b: "Malware",
    option_c: "Phishing",
    option_d: "Firewall",
  },
  {
    id: 3,
    question:
      "Tizimda xavfsizlik zaifligi mavjud, ammo undan hali hech kim foydalanmagan. Bu holat nima deb ataladi?",
    option_a: "Risk",
    option_b: "Threat",
    option_c: "Vulnerability",
    option_d: "Incident",
  },
  {
    id: 4,
    question:
      "Muhim ma’lumotlar bazasida zaiflik bor. Hujumchi undan foydalanib zarar yetkazishi mumkin. Ushbu zarar yuz berish ehtimoli va ta’siri qanday tushuncha bilan ifodalanadi?",
    option_a: "Integrity",
    option_b: "Availability",
    option_c: "Risk",
    option_d: "Authentication",
  },
  {
    id: 5,
    question:
      "Tizim egasi xavfsizlik testini o‘tkazish uchun mutaxassisga rasmiy ruxsat berdi. Mutaxassis zaifliklarni topib, egasiga hisobot beradi. Bu qaysi turdagi hackerga mos?",
    option_a: "Black Hat",
    option_b: "White Hat",
    option_c: "Gray Hat",
    option_d: "Threat Actor",
  },
  {
    id: 6,
    question:
      "Serverga juda ko‘p so‘rov yuborilib, oddiy foydalanuvchilar xizmatdan foydalana olmay qoldi. CIA Triadning qaysi prinsipi eng bevosita buzilgan?",
    option_a: "Confidentiality",
    option_b: "Integrity",
    option_c: "Availability",
    option_d: "Authentication",
  },
  {
    id: 7,
    question:
      "Noma’lum .exe fayl ishga tushirilgandan keyin kompyuterdagi fayllar buzila boshladi. Bu holatdagi zararli dasturiy ta’minot qanday umumiy nomlanadi?",
    option_a: "Malware",
    option_b: "Firewall",
    option_c: "Patch",
    option_d: "Proxy",
  },
  {
    id: 8,
    question:
      "Kompaniyaning mijozlarga oid shaxsiy ma’lumotlarini faqat ruxsat berilgan xodimlar ko‘ra olishi kerak. Bu CIA Triadning qaysi prinsipi?",
    option_a: "Availability",
    option_b: "Integrity",
    option_c: "Confidentiality",
    option_d: "Recovery",
  },
  {
    id: 9,
    question:
      "Quyidagi ketma-ketliklardan qaysi biri kiberxavfsizlikdagi tushunchalar o‘rtasidagi munosabatni to‘g‘ri ifodalaydi?",
    option_a: "Risk → Vulnerability → Threat",
    option_b: "Vulnerability → Threat → Risk",
    option_c: "Threat → Risk → Vulnerability",
    option_d: "Availability → Threat → Risk",
  },
  {
    id: 10,
    question: "White Hat hackerning asosiy xususiyati qaysi?",
    option_a: "Ruxsatsiz tizimga kirib zarar yetkazish",
    option_b: "Ruxsat asosida xavfsizlik testlarini o‘tkazish",
    option_c: "Faqat DDoS hujumlarini amalga oshirish",
    option_d: "Foydalanuvchi parollarini yashirincha yig‘ish",
  },
];

type Section = {
  id: string;
  number: string;
  title: string;
  short: string;
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();

  const courseSlug = decodeURIComponent(
    String(params.CourseSlug || params.courseSlug || "")
  ).trim();

  const lessonSlug = decodeURIComponent(
    String(params.LessonSlug || params.lessonSlug || "")
  ).trim();

  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  const [loading, setLoading] = useState(true);
  const [xato, setXato] = useState("");

  const [activeSection, setActiveSection] = useState("intro");
  const [readProgress, setReadProgress] = useState(0);

  const [phishingAnswer, setPhishingAnswer] = useState("");
  const [phishingChecked, setPhishingChecked] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizXato, setQuizXato] = useState("");

  const sections: Section[] = useMemo(
    () => [
      {
        id: "intro",
        number: "01",
        title: "Kiberxavfsizlik nima?",
        short: "Asosiy tushuncha",
      },
      {
        id: "hacker",
        number: "02",
        title: "Hacker kim?",
        short: "White Hat / Black Hat / Gray Hat",
      },
      {
        id: "risk",
        number: "03",
        title: "Zaiflik, Threat va Risk",
        short: "Xavfni tushunish",
      },
      {
        id: "attacks",
        number: "04",
        title: "Kiberhujumlar",
        short: "Phishing / Malware / DDoS",
      },
      {
        id: "cia",
        number: "05",
        title: "CIA Triad",
        short: "3 asosiy tamoyil",
      },
      {
        id: "career",
        number: "06",
        title: "Kiberxavfsizlik mutaxassisi",
        short: "Yo‘nalishlar",
      },
      {
        id: "summary",
        number: "07",
        title: "Xulosa",
        short: "Bilimlarni mustahkamlash",
      },
      {
        id: "quiz",
        number: "08",
        title: "Bilimni tekshirish",
        short: "10 ta savol",
      },
    ],
    []
  );

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    async function yuklash() {
      try {
        setLoading(true);
        setXato("");

        // 1. KURSLARNI OLISH
        const courseResponse = await fetch(`${API}/courses`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (courseResponse.status === 401) {
          const data = await courseResponse.json().catch(() => null);
          setXato(
            data?.detail ||
              "Token muddati tugagan yoki token noto‘g‘ri. Qayta login qiling."
          );
          return;
        }

        if (!courseResponse.ok) {
          throw new Error("Kurslarni yuklashda xatolik");
        }

        const courseData = await courseResponse.json();
        const courses: Course[] = Array.isArray(courseData)
          ? courseData
          : Array.isArray(courseData.courses)
          ? courseData.courses
          : [];

        const topilganKurs = courses.find(
          (kurs: Course) =>
            String(kurs.slug).trim().toLowerCase() ===
            courseSlug.trim().toLowerCase()
        );

        if (!topilganKurs) {
          setXato(`Kurs topilmadi: ${courseSlug || "slug bo‘sh"}`);
          return;
        }

        setCourse(topilganKurs);

        // 2. LESSONLARNI OLISH
        const lessonResponse = await fetch(
          `${API}/courses/${topilganKurs.id}/lessons`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (lessonResponse.status === 401) {
          const data = await lessonResponse.json().catch(() => null);
          setXato(
            `Lessons API xatosi: ${
              data?.detail ||
              "401 Unauthorized. Tokenni tekshiring yoki qayta login qiling."
            }`
          );
          return;
        }

        if (lessonResponse.status === 404) {
          setXato("Bu kurs uchun lesson topilmadi");
          return;
        }

        if (!lessonResponse.ok) {
          const data = await lessonResponse.json().catch(() => null);
          throw new Error(data?.detail || "Lessonlarni yuklashda xatolik");
        }

        const lessonData = await lessonResponse.json();
        const lessons: Lesson[] = Array.isArray(lessonData)
          ? lessonData
          : Array.isArray(lessonData.lessons)
          ? lessonData.lessons
          : [];

        const topilganLesson = lessons.find(
          (item: Lesson) =>
            String(item.slug).trim().toLowerCase() ===
            lessonSlug.trim().toLowerCase()
        );

        if (!topilganLesson) {
          setXato(`Lesson topilmadi: ${lessonSlug || "slug bo‘sh"}`);
          return;
        }

        setLesson(topilganLesson);
      } catch (error) {
        setXato(
          error instanceof Error
            ? error.message
            : "Lessonni yuklashda xatolik yuz berdi"
        );
      } finally {
        setLoading(false);
      }
    }

    yuklash();
  }, [courseSlug, lessonSlug]);

  // SCROLL PROGRESS
  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (documentHeight <= 0) {
        setReadProgress(0);
        return;
      }

      const progress = Math.min(
        100,
        Math.max(0, (scrollTop / documentHeight) * 100)
      );
      setReadProgress(progress);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#03060b] text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-400" />
          <p className="text-sm text-gray-400">
            Cybersecurity lesson yuklanmoqda...
          </p>
        </div>
      </main>
    );
  }

  if (xato || !course || !lesson) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#03060b] px-6 text-white">
        <div className="w-full max-w-xl rounded-3xl border border-red-500/20 bg-red-500/[0.04] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-3xl text-red-400">
            !
          </div>
          <h1 className="text-2xl font-bold">Darsni yuklab bo‘lmadi</h1>
          <p className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-gray-400">
            {xato || "Lesson topilmadi"}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
            >
              Qayta yuklash
            </button>
            <button
              type="button"
              onClick={() =>
                router.push(courseSlug ? `/learn/${courseSlug}` : "/learn")
              }
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              ← Kursga qaytish
            </button>
          </div>
        </div>
      </main>
    );
  }

  function sectiongaOtish(id: string) {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function quizJavobTanlash(questionId: number, answer: string) {
    if (quizResult || quizSubmitting) return;
    setQuizAnswers((old) => ({
      ...old,
      [questionId]: answer,
    }));
  }

  async function quizniYuborish() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    if (Object.keys(quizAnswers).length !== QUIZ_SAVOLLARI.length) {
      setQuizXato("Iltimos, barcha 10 ta savolga javob bering.");
      return;
    }

    try {
      setQuizSubmitting(true);
      setQuizXato("");

      const response = await fetch(`${API}/lessons/${lesson?.id}/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers: QUIZ_SAVOLLARI.map((savol) => ({
            question_id: savol.id,
            answer: quizAnswers[savol.id],
          })),
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail || "Quizni tekshirishda xatolik yuz berdi."
        );
      }

      setQuizResult(data as QuizResult);
    } catch (error) {
      setQuizXato(
        error instanceof Error
          ? error.message
          : "Quizni yuborishda xatolik yuz berdi."
      );
    } finally {
      setQuizSubmitting(false);
    }
  }

  function quizniQaytaBoshlash() {
    setQuizAnswers({});
    setQuizResult(null);
    setQuizXato("");
    setTimeout(() => sectiongaOtish("quiz"), 50);
  }

  function phishingniTekshirish() {
    setPhishingChecked(true);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#03060b] text-white">
      {/* TOP PROGRESS */}
      <div className="fixed left-0 right-0 top-0 z-50 h-[2px] bg-white/5">
        <div
          className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#03060b]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <button
            type="button"
            onClick={() => router.push(`/learn/${course.slug}`)}
            className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <span className="text-lg">←</span>
            Kursga qaytish
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="text-lg font-bold tracking-tight md:text-xl"
          >
            Cyber<span className="text-blue-500">Forge</span>
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.06] px-3 py-1.5 text-xs text-blue-400 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
            O‘qish rejimi
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative border-b border-white/10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/[0.06] blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold tracking-wider text-blue-400">
                  LESSON {String(lesson.order).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-500">
                  {course.level}
                </span>
                {course.is_pro && (
                  <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-400">
                    PRO
                  </span>
                )}
              </div>

              <p className="mb-4 text-sm font-medium text-blue-400">
                {course.title}
              </p>

              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                {lesson.title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
                Kiberxavfsizlik dunyosiga kirish. Tahdidlar, hujumlar,
                hackerlar va tizimlarni himoya qilish asoslarini
                bosqichma-bosqich o‘rganing.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => sectiongaOtish("intro")}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold shadow-[0_0_30px_rgba(37,99,235,0.18)] transition hover:bg-blue-500"
                >
                  Darsni boshlash
                </button>
                <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-gray-400">
                  Taxminan 10 daqiqa
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute inset-0 rounded-[40px] bg-blue-500/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-blue-500/20 bg-[#07101d] p-8 shadow-2xl">
                <div className="absolute right-5 top-5 text-[10px] uppercase tracking-[0.3em] text-blue-500/50">
                  SECURE NODE
                </div>

                <div className="flex h-72 items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-[-45px] rounded-full border border-blue-500/10" />
                    <div className="absolute inset-[-25px] rounded-full border border-blue-500/20 border-dashed" />
                    <div className="flex h-40 w-40 items-center justify-center rounded-[42px] border border-blue-400/30 bg-blue-500/[0.08] shadow-[0_0_70px_rgba(37,99,235,0.22)]">
                      <div className="relative flex h-24 w-20 items-center justify-center rounded-b-2xl rounded-t-[45%] border-2 border-blue-400/70 bg-blue-500/[0.08]">
                        <div className="h-7 w-7 rounded-full border-2 border-blue-300/80" />
                        <div className="absolute top-[48px] h-8 w-1 rounded-full bg-blue-300/70" />
                      </div>
                    </div>
                    <div className="absolute -right-20 top-2 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-3 py-2 text-[10px] text-red-400">
                      THREAT
                    </div>
                    <div className="absolute -left-20 bottom-2 rounded-xl border border-green-500/20 bg-green-500/[0.05] px-3 py-2 text-[10px] text-green-400">
                      PROTECTED
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center">
                    <p className="text-lg font-bold text-white">01</p>
                    <p className="mt-1 text-[10px] text-gray-500">THREAT</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center">
                    <p className="text-lg font-bold text-white">02</p>
                    <p className="mt-1 text-[10px] text-gray-500">RISK</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center">
                    <p className="text-lg font-bold text-white">03</p>
                    <p className="mt-1 text-[10px] text-gray-500">DEFENSE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:px-8 lg:grid-cols-[250px_1fr]">
        {/* SIDE NAV */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-600">
              Dars tarkibi
            </p>

            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => sectiongaOtish(section.id)}
                  className={`group w-full rounded-xl border p-3 text-left transition ${
                    activeSection === section.id
                      ? "border-blue-500/20 bg-blue-500/[0.07]"
                      : "border-transparent hover:border-white/5 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex gap-3">
                    <span
                      className={`text-xs ${
                        activeSection === section.id
                          ? "text-blue-400"
                          : "text-gray-600"
                      }`}
                    >
                      {section.number}
                    </span>
                    <div>
                      <p
                        className={`text-xs font-medium ${
                          activeSection === section.id
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {section.title}
                      </p>
                      <p className="mt-1 text-[10px] text-gray-600">
                        {section.short}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs font-semibold text-gray-300">
                O‘qish progressi
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${readProgress}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] text-gray-600">
                {Math.round(readProgress)}% o‘qildi
              </p>
            </div>
          </div>
        </aside>

        {/* LESSON BODY */}
        <article className="min-w-0 space-y-8">
          {/* INTRO */}
          <section
            id="intro"
            className="scroll-mt-28 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]"
          >
            <div className="border-b border-white/10 p-7 md:p-10">
              <div className="flex items-center gap-3">
                <span className="text-xs text-blue-400">01</span>
                <span className="h-px w-10 bg-blue-500/40" />
                <span className="text-xs uppercase tracking-[0.2em] text-gray-600">
                  Foundation
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
                Kiberxavfsizlik nima?
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-gray-400">
                Kiberxavfsizlik — kompyuterlar, tarmoqlar, dasturlar va
                ma’lumotlarni turli kiber tahdidlardan himoya qilishga
                qaratilgan jarayonlar va amaliyotlar majmuasidir.
              </p>
            </div>

            <div className="grid gap-px bg-white/10 md:grid-cols-3">
              <div className="bg-[#060b12] p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                  ◇
                </div>
                <h3 className="font-semibold">Ma’lumot</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Muhim ma’lumotlarni himoya qilish.
                </p>
              </div>

              <div className="bg-[#060b12] p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                  ◌
                </div>
                <h3 className="font-semibold">Tizim</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Qurilmalar va dasturlarni himoyalash.
                </p>
              </div>

              <div className="bg-[#060b12] p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                  ⌁
                </div>
                <h3 className="font-semibold">Tarmoq</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Tarmoq orqali keladigan tahdidlarni nazorat qilish.
                </p>
              </div>
            </div>
          </section>

          {/* WHY IMPORTANT */}
          <section className="rounded-3xl border border-blue-500/10 bg-blue-500/[0.025] p-7 md:p-10">
            <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Nega muhim?
                </p>
                <h2 className="mt-3 text-2xl font-bold">
                  Bitta zaif nuqta katta muammoga aylanishi mumkin.
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Shaxsiy ma’lumotlar",
                  "Hisoblar va parollar",
                  "Korporativ ma’lumotlar",
                  "Tizimlar va xizmatlar",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <span className="text-xs text-blue-500">0{index + 1}</span>
                    <p className="mt-2 text-sm font-medium text-gray-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* HACKER */}
          <section
            id="hacker"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.025] p-7 md:p-10"
          >
            <div>
              <span className="text-xs text-blue-400">02 / HACKER</span>
              <h2 className="mt-4 text-3xl font-bold">Hacker kim?</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-500">
                Hacker atamasi tizimlar va texnologiyalarni chuqur tushunadigan
                shaxsga nisbatan ishlatiladi. Maqsadiga qarab hackerlar turli
                guruhlarga ajratiladi.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="group rounded-2xl border border-green-500/20 bg-green-500/[0.03] p-6 transition hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">+</span>
                  <span className="text-[10px] tracking-[0.2em] text-green-400">
                    WHITE HAT
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold">White Hat</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Tizimlardagi zaifliklarni qonuniy va ruxsat asosida
                  aniqlashga yordam beradi.
                </p>
              </div>

              <div className="group rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6 transition hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">!</span>
                  <span className="text-[10px] tracking-[0.2em] text-red-400">
                    BLACK HAT
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold">Black Hat</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Ruxsatsiz kirish yoki zarar yetkazish kabi noqonuniy
                  faoliyatlar bilan bog‘liq.
                </p>
              </div>

              <div className="group rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.03] p-6 transition hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">~</span>
                  <span className="text-[10px] tracking-[0.2em] text-yellow-400">
                    GRAY HAT
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold">Gray Hat</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  White Hat va Black Hat o‘rtasidagi xatti-harakatlar bilan
                  bog‘liq bo‘lishi mumkin.
                </p>
              </div>
            </div>
          </section>

          {/* RISK */}
          <section
            id="risk"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.025] p-7 md:p-10"
          >
            <span className="text-xs text-blue-400">03 / RISK MODEL</span>
            <h2 className="mt-4 text-3xl font-bold">Zaiflik → Threat → Risk</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-500">
              Kiberxavfsizlikda bu tushunchalarni farqlash juda muhim. Ular bir
              xil narsa emas.
            </p>

            <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex-1 rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] p-6">
                <span className="text-xs text-orange-400">01</span>
                <h3 className="mt-3 font-bold">Zaiflik</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Tizimdagi zaif yoki himoyasiz nuqta.
                </p>
              </div>

              <div className="hidden text-xl text-gray-700 md:block">→</div>

              <div className="flex-1 rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-6">
                <span className="text-xs text-red-400">02</span>
                <h3 className="mt-3 font-bold">Threat</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Zaiflikdan foydalanishi mumkin bo‘lgan tahdid.
                </p>
              </div>

              <div className="hidden text-xl text-gray-700 md:block">→</div>

              <div className="flex-1 rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] p-6">
                <span className="text-xs text-purple-400">03</span>
                <h3 className="mt-3 font-bold">Risk</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Tahdid natijasida zarar yuzaga kelish ehtimoli.
                </p>
              </div>
            </div>
          </section>

          {/* ATTACKS */}
          <section
            id="attacks"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.025] p-7 md:p-10"
          >
            <span className="text-xs text-blue-400">04 / ATTACKS</span>
            <h2 className="mt-4 text-3xl font-bold">Kiberhujumlar</h2>
            <p className="mt-4 text-sm leading-7 text-gray-500">
              Darsda uchraydigan asosiy hujum turlarini tushunib oling.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                  ✉
                </div>
                <h3 className="mt-5 text-lg font-bold">Phishing</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Foydalanuvchini aldab, masalan, soxta xabar yoki havola orqali
                  ma’lumot olishga urinish.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
                  ◈
                </div>
                <h3 className="mt-5 text-lg font-bold">Malware</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Tizimga zarar yetkazish yoki nomaqbul faoliyat bajarish uchun
                  yaratilgan zararli dasturiy ta’minot.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
                  ≋
                </div>
                <h3 className="mt-5 text-lg font-bold">DDoS</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Xizmatga juda ko‘p trafik yoki so‘rov yuborib, uning
                  mavjudligiga ta’sir qilishga qaratilgan hujum.
                </p>
              </div>
            </div>

            {/* PHISHING CASE */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-blue-500/15 bg-blue-500/[0.025]">
              <div className="border-b border-white/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Mini Case
                </p>
                <h3 className="mt-2 font-bold">Phishingni aniqlang</h3>
              </div>

              <div className="p-6 md:p-8">
                <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#080d14] shadow-xl">
                  <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                    <span className="ml-3 text-[10px] text-gray-600">
                      secure-bank.example
                    </span>
                  </div>

                  <div className="p-6">
                    <p className="text-xs text-gray-600">Yangi xabar</p>
                    <h4 className="mt-3 font-semibold">
                      Hisobingiz bloklanishi mumkin
                    </h4>
                    <p className="mt-4 text-sm leading-6 text-gray-500">
                      Hisobingizni tasdiqlash uchun quyidagi havolani bosing. Aks
                      holda hisobingiz vaqtincha bloklanadi.
                    </p>
                    <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4 text-xs text-red-300">
                      http://bank-login-verification.example
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPhishingAnswer("phishing");
                      setPhishingChecked(false);
                    }}
                    className={`rounded-xl border p-4 text-left transition ${
                      phishingAnswer === "phishing"
                        ? "border-blue-500/40 bg-blue-500/10"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                    }`}
                  >
                    <p className="text-sm font-semibold">
                      Bu phishing bo‘lishi mumkin
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      Shubhali havola va qo‘rqituvchi matn.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPhishingAnswer("normal");
                      setPhishingChecked(false);
                    }}
                    className={`rounded-xl border p-4 text-left transition ${
                      phishingAnswer === "normal"
                        ? "border-blue-500/40 bg-blue-500/10"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                    }`}
                  >
                    <p className="text-sm font-semibold">Oddiy bank xabari</p>
                    <p className="mt-1 text-xs text-gray-600">
                      Havolani ochib ko‘rish kerak.
                    </p>
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!phishingAnswer}
                  onClick={phishingniTekshirish}
                  className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Tekshirish
                </button>

                {phishingChecked && (
                  <div
                    className={`mt-4 rounded-xl border p-4 text-sm ${
                      phishingAnswer === "phishing"
                        ? "border-green-500/20 bg-green-500/[0.04] text-green-400"
                        : "border-red-500/20 bg-red-500/[0.04] text-red-400"
                    }`}
                  >
                    {phishingAnswer === "phishing"
                      ? "To‘g‘ri. Shubhali havola va foydalanuvchini shoshiltiruvchi xabar phishing belgilaridan bo‘lishi mumkin."
                      : "Bu vaziyatda ehtiyot bo‘lish kerak. Shubhali havola va tahdidli xabar phishing belgisi bo‘lishi mumkin."}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CIA TRIAD */}
          <section
            id="cia"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.025] p-7 md:p-10"
          >
            <span className="text-xs text-blue-400">05 / CIA TRIAD</span>
            <h2 className="mt-4 text-3xl font-bold">CIA Triad</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-500">
              Kiberxavfsizlikdagi uchta muhim tamoyil: Confidentiality,
              Integrity va Availability.
            </p>

            <div className="mx-auto mt-10 max-w-2xl">
              <div className="relative aspect-square">
                <div className="absolute inset-[15%] rotate-45 rounded-[32px] border border-blue-500/20 bg-blue-500/[0.03]" />

                <div className="absolute left-1/2 top-0 -translate-x-1/2 text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400">
                    <span className="text-2xl">C</span>
                  </div>
                  <p className="mt-3 text-xs font-semibold">Confidentiality</p>
                  <p className="mt-1 text-[10px] text-gray-600">Maxfiylik</p>
                </div>

                <div className="absolute bottom-0 left-0 text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400">
                    <span className="text-2xl">I</span>
                  </div>
                  <p className="mt-3 text-xs font-semibold">Integrity</p>
                  <p className="mt-1 text-[10px] text-gray-600">Yaxlitlik</p>
                </div>

                <div className="absolute bottom-0 right-0 text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 text-green-400">
                    <span className="text-2xl">A</span>
                  </div>
                  <p className="mt-3 text-xs font-semibold">Availability</p>
                  <p className="mt-1 text-[10px] text-gray-600">Mavjudlik</p>
                </div>

                <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#07101b] text-center shadow-2xl">
                  <div>
                    <p className="text-xl font-bold">CIA</p>
                    <p className="mt-1 text-[9px] uppercase tracking-widest text-gray-600">
                      Security
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-blue-500/10 bg-blue-500/[0.03] p-5">
                <p className="text-xs font-bold text-blue-400">
                  CONFIDENTIALITY
                </p>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Ma’lumot faqat ruxsat berilgan shaxslar tomonidan
                  ko‘rilishi.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-500/10 bg-purple-500/[0.03] p-5">
                <p className="text-xs font-bold text-purple-400">INTEGRITY</p>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Ma’lumotning noto‘g‘ri yoki ruxsatsiz o‘zgartirilmasligi.
                </p>
              </div>

              <div className="rounded-2xl border border-green-500/10 bg-green-500/[0.03] p-5">
                <p className="text-xs font-bold text-green-400">AVAILABILITY</p>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Kerakli vaqtda tizim yoki ma’lumotdan foydalanish imkoniyati.
                </p>
              </div>
            </div>
          </section>

          {/* CAREER */}
          <section
            id="career"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.025] p-7 md:p-10"
          >
            <span className="text-xs text-blue-400">06 / CAREER MAP</span>
            <h2 className="mt-4 text-3xl font-bold">
              Kiberxavfsizlik mutaxassisi
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-500">
              Kiberxavfsizlik bitta kasb emas. Turli yo‘nalishlar mavjud va har
              biri o‘z vazifalariga ega.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ["01", "Network Security", "Tarmoqlarni himoyalash."],
                ["02", "SOC / Blue Team", "Hodisalarni kuzatish va aniqlash."],
                [
                  "03",
                  "Penetration Testing",
                  "Zaifliklarni ruxsat asosida tekshirish.",
                ],
                ["04", "Web Security", "Web ilovalar xavfsizligi."],
                ["05", "Digital Forensics", "Raqamli dalillarni tahlil qilish."],
                [
                  "06",
                  "Incident Response",
                  "Xavfsizlik hodisalariga javob berish.",
                ],
                ["07", "Cloud Security", "Cloud muhitlarini himoyalash."],
                ["08", "Secure Coding", "Xavfsiz dasturiy ta’minot yaratish."],
                [
                  "09",
                  "Security Engineering",
                  "Xavfsizlik tizimlarini loyihalash.",
                ],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="group rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-blue-500/20 hover:bg-blue-500/[0.025]"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs text-blue-500">{number}</span>
                    <span className="text-gray-700 transition group-hover:text-blue-500">
                      ↗
                    </span>
                  </div>
                  <h3 className="mt-5 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* RAW CONTENT */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 md:p-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-600">
                  Original lesson
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  Qo‘shimcha maruza matni
                </h2>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-gray-600">
                SOURCE
              </span>
            </div>

            <div className="mt-6 whitespace-pre-wrap rounded-2xl border border-white/5 bg-black/20 p-6 text-sm leading-8 text-gray-500">
              {lesson.content ||
                "Bu lesson uchun qo‘shimcha kontent mavjud emas."}
            </div>
          </section>

          {/* SUMMARY */}
          <section
            id="summary"
            className="scroll-mt-28 overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.08] to-transparent p-7 md:p-10"
          >
            <span className="text-xs text-blue-400">
              07 / COMPLETE THE THEORY
            </span>
            <h2 className="mt-4 text-3xl font-bold">
              Siz nimalarni o‘rgandingiz?
            </h2>

            <div className="mt-8 space-y-3">
              {[
                "Kiberxavfsizlik tushunchasi",
                "White Hat, Black Hat va Gray Hat",
                "Zaiflik, Threat va Risk farqi",
                "Phishing, Malware va DDoS",
                "CIA Triad: Confidentiality, Integrity, Availability",
                "Kiberxavfsizlikdagi asosiy yo‘nalishlar",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-xs text-blue-400">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </section>
          {/* QUIZ */}
          <section
            id="quiz"
            className="scroll-mt-28 overflow-hidden rounded-3xl border border-blue-500/20 bg-[#050b14]"
          >
            <div className="border-b border-white/10 bg-gradient-to-r from-blue-500/[0.08] to-transparent p-7 md:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-blue-400">
                      08
                    </span>
                    <span className="h-px w-10 bg-blue-500/40" />
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-600">
                      Knowledge Check
                    </span>
                  </div>

                  <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
                    Bilimingizni tekshiring
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
                    Maruzadagi asosiy tushunchalarni 10 ta savol orqali
                    tekshiring. O‘tish uchun kamida 7 ta to‘g‘ri javob kerak.
                  </p>
                </div>

                <div className="shrink-0 rounded-2xl border border-blue-500/20 bg-blue-500/10 px-6 py-5 text-center shadow-[0_0_35px_rgba(37,99,235,0.08)]">
                  <p className="text-2xl font-bold text-blue-400">+20</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    XP reward
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-8">
              {!quizResult && (
                <div className="mb-7 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="font-semibold text-gray-300">
                      Quiz progress
                    </span>
                    <span className="text-blue-400">
                      {Object.keys(quizAnswers).length} / {QUIZ_SAVOLLARI.length}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all"
                      style={{
                        width: `${
                          (Object.keys(quizAnswers).length /
                            QUIZ_SAVOLLARI.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {quizXato && (
                <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-4 text-sm text-red-300">
                  {quizXato}
                </div>
              )}

              <div className="space-y-5">
                {QUIZ_SAVOLLARI.map((savol, index) => {
                  const tanlangan = quizAnswers[savol.id];
                  const feedback = quizResult?.feedback.find(
                    (item) => item.question_id === savol.id
                  );

                  const variantlar = [
                    ["A", savol.option_a],
                    ["B", savol.option_b],
                    ["C", savol.option_c],
                    ["D", savol.option_d],
                  ];

                  return (
                    <div
                      key={savol.id}
                      className={`rounded-2xl border bg-black/20 p-5 md:p-6 ${
                        feedback
                          ? feedback.correct
                            ? "border-green-500/20"
                            : "border-red-500/20"
                          : "border-white/10"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-xs font-bold text-blue-400">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600">
                              Question {index + 1}
                            </span>
                            {feedback && (
                              <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                                  feedback.correct
                                    ? "border-green-500/20 bg-green-500/10 text-green-400"
                                    : "border-red-500/20 bg-red-500/10 text-red-400"
                                }`}
                              >
                                {feedback.correct ? "To‘g‘ri" : "Xato"}
                              </span>
                            )}
                          </div>

                          <h3 className="mt-3 text-sm font-semibold leading-7 text-gray-200 md:text-base">
                            {savol.question}
                          </h3>

                          <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {variantlar.map(([letter, text]) => {
                              const selected = tanlangan === letter;
                              const correctAfterSubmit =
                                feedback?.correct_answer === letter;
                              const wrongSelected =
                                Boolean(feedback) &&
                                selected &&
                                !feedback?.correct;

                              return (
                                <button
                                  key={letter}
                                  type="button"
                                  disabled={
                                    Boolean(quizResult) || quizSubmitting
                                  }
                                  onClick={() =>
                                    quizJavobTanlash(savol.id, letter)
                                  }
                                  className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                                    correctAfterSubmit
                                      ? "border-green-500/30 bg-green-500/[0.07]"
                                      : wrongSelected
                                      ? "border-red-500/30 bg-red-500/[0.07]"
                                      : selected
                                      ? "border-blue-500/40 bg-blue-500/[0.08] shadow-[0_0_25px_rgba(37,99,235,0.08)]"
                                      : "border-white/10 bg-white/[0.02] hover:border-blue-500/20 hover:bg-blue-500/[0.04]"
                                  } ${quizResult ? "cursor-default" : ""}`}
                                >
                                  <span
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
                                      correctAfterSubmit
                                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                                        : wrongSelected
                                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                                        : selected
                                        ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                                        : "border-white/10 bg-white/[0.03] text-gray-500 group-hover:text-blue-400"
                                    }`}
                                  >
                                    {letter}
                                  </span>
                                  <span className="pt-1 text-sm leading-6 text-gray-400">
                                    {text}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {feedback && (
                            <div
                              className={`mt-4 rounded-xl border p-4 ${
                                feedback.correct
                                  ? "border-green-500/15 bg-green-500/[0.04]"
                                  : "border-red-500/15 bg-red-500/[0.04]"
                              }`}
                            >
                              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
                                <span
                                  className={
                                    feedback.correct
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }
                                >
                                  Sizning javobingiz:{" "}
                                  <strong>{feedback.user_answer}</strong>
                                </span>
                                {!feedback.correct && (
                                  <span className="text-green-400">
                                    To‘g‘ri javob:{" "}
                                    <strong>{feedback.correct_answer}</strong>
                                  </span>
                                )}
                              </div>
                              <p className="mt-3 text-sm leading-6 text-gray-400">
                                {feedback.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!quizResult ? (
                <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-blue-500/15 bg-blue-500/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-200">
                      Tayyor bo‘lsangiz, javoblarni yuboring.
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      Barcha 10 ta savolga javob berish talab qilinadi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={quizniYuborish}
                    disabled={
                      quizSubmitting ||
                      Object.keys(quizAnswers).length !== 10
                    }
                    className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(37,99,235,0.15)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {quizSubmitting ? "Tekshirilmoqda..." : "Quizni yuborish →"}
                  </button>
                </div>
              ) : (
                <div
                  className={`mt-7 overflow-hidden rounded-2xl border p-6 md:p-8 ${
                    quizResult.passed
                      ? "border-green-500/20 bg-green-500/[0.04]"
                      : "border-red-500/20 bg-red-500/[0.04]"
                  }`}
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p
                        className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                          quizResult.passed ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {quizResult.passed ? "Quiz passed" : "Quiz failed"}
                      </p>
                      <h3 className="mt-3 text-3xl font-bold">
                        {quizResult.score} / {quizResult.total}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        {quizResult.passed
                          ? "Tabriklaymiz. Lesson muvaffaqiyatli yakunlandi."
                          : "Kamida 7 ta to‘g‘ri javob kerak. Qayta urinib ko‘ring."}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 px-6 py-5 text-center">
                      <p className="text-xl font-bold text-blue-400">
                        +{quizResult.xp_added} XP
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-widest text-gray-600">
                        Current XP: {quizResult.xp}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={quizniQaytaBoshlash}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.07] hover:text-white"
                    >
                      Qayta ishlash
                    </button>
                    {quizResult.passed && (
                      <button
                        type="button"
                        onClick={() => sectiongaOtish("summary")}
                        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
                      >
                        Keyingi bosqich →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* FOOTER NAVIGATION */}
          <div className="flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => router.push(`/learn/${course.slug}`)}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              ← Kursga qaytish
            </button>

            <button
              type="button"
              onClick={() => sectiongaOtish("quiz")}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
            >
              Bilimni tekshirish →
              
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}