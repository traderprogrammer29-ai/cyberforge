"use client";

import { useState } from "react";
import Link from "next/link";

type Room = {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tasks: number;
  xp: number;
  isFree: boolean;
  slug?: string;
};

const ROOMS: Room[] = [
  {
    id: 1,
    title: "Network Reconnaissance",
    description:
      "Tarmoqni kuzatish, qurilmalarni aniqlash va asosiy network reconnaissance tushunchalarini amaliy simulator orqali o‘rganing.",
    difficulty: "Beginner",
    tasks: 5,
    xp: 50,
    isFree: true,
    slug: "room-1",
  },
  {
    id: 2,
    title: "Port Discovery",
    description:
      "Tizimdagi ochiq portlarni aniqlash va portlarning vazifalarini amaliy tarzda o‘rganing.",
    difficulty: "Beginner",
    tasks: 7,
    xp: 50,
    isFree: false,
  },
  {
    id: 3,
    title: "Service Enumeration",
    description:
      "Tarmoqdagi xizmatlarni aniqlash va ular haqida ma’lumot yig‘ish jarayonini o‘rganing.",
    difficulty: "Beginner",
    tasks: 7,
    xp: 50,
    isFree: false,
  },
  {
    id: 4,
    title: "IP Address Analysis",
    description:
      "IP manzillar, hostlar va tarmoqdagi qurilmalar o‘rtasidagi bog‘lanishni tahlil qiling.",
    difficulty: "Beginner",
    tasks: 6,
    xp: 50,
    isFree: false,
  },
  {
    id: 5,
    title: "DNS Discovery",
    description:
      "DNS qanday ishlashini va domain nomlari qanday qilib IP manzillarga bog‘lanishini o‘rganing.",
    difficulty: "Beginner",
    tasks: 6,
    xp: 50,
    isFree: false,
  },
  {
    id: 6,
    title: "DNS Enumeration",
    description:
      "DNS ma’lumotlarini tahlil qilish va tarmoq infratuzilmasi haqida ma’lumot topishni o‘rganing.",
    difficulty: "Intermediate",
    tasks: 8,
    xp: 75,
    isFree: false,
  },
  {
    id: 7,
    title: "HTTP Discovery",
    description:
      "HTTP protokoli, web serverlar va HTTP xizmatlarini network nuqtai nazaridan tekshiring.",
    difficulty: "Intermediate",
    tasks: 7,
    xp: 75,
    isFree: false,
  },
  {
    id: 8,
    title: "Network Traffic Analysis",
    description:
      "Tarmoq orqali harakatlanayotgan trafikni kuzatish va asosiy trafik turlarini ajratishni o‘rganing.",
    difficulty: "Intermediate",
    tasks: 8,
    xp: 100,
    isFree: false,
  },
  {
    id: 9,
    title: "Packet Inspection",
    description:
      "Network packetlarning tuzilishini ko‘rib chiqing va ulardan foydali ma’lumotlarni ajrating.",
    difficulty: "Intermediate",
    tasks: 8,
    xp: 100,
    isFree: false,
  },
  {
    id: 10,
    title: "ARP & Local Network",
    description:
      "ARP protokoli va local network ichidagi qurilmalar qanday aniqlanishini amaliy o‘rganing.",
    difficulty: "Intermediate",
    tasks: 8,
    xp: 100,
    isFree: false,
  },
  {
    id: 11,
    title: "Routing & Gateway",
    description:
      "Router, gateway va packetlarning bir networkdan boshqasiga qanday yetib borishini o‘rganing.",
    difficulty: "Intermediate",
    tasks: 9,
    xp: 125,
    isFree: false,
  },
  {
    id: 12,
    title: "Subnetting Challenge",
    description:
      "Subnet, network address, host range va subnet mask bilan bog‘liq amaliy challenge.",
    difficulty: "Advanced",
    tasks: 10,
    xp: 150,
    isFree: false,
  },
  {
    id: 13,
    title: "Network Misconfiguration",
    description:
      "Noto‘g‘ri sozlangan network qurilmalarini aniqlang va xavfsizlik muammolarini toping.",
    difficulty: "Advanced",
    tasks: 10,
    xp: 150,
    isFree: false,
  },
  {
    id: 14,
    title: "Network Attack Detection",
    description:
      "Shubhali network faoliyatini aniqlash va hujum belgilarini trafik orqali topishni o‘rganing.",
    difficulty: "Advanced",
    tasks: 10,
    xp: 175,
    isFree: false,
  },
  {
    id: 15,
    title: "Network Security Challenge",
    description:
      "Network Discovery bo‘limida o‘rgangan bilimlaringizni yakuniy amaliy challenge orqali sinab ko‘ring.",
    difficulty: "Advanced",
    tasks: 12,
    xp: 250,
    isFree: false,
  },
];

const DIFFICULTY_STYLES = {
  Beginner:
    "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Intermediate:
    "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Advanced:
    "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export default function NetworkDiscoveryPage() {
  const [selectedProRoom, setSelectedProRoom] = useState<Room | null>(null);

  const freeRooms = ROOMS.filter((room) => room.isFree).length;
  const proRooms = ROOMS.filter((room) => !room.isFree).length;

  const openRoom = (room: Room) => {
    if (room.isFree && room.slug) {
      return;
    }

    if (!room.isFree) {
      setSelectedProRoom(room);
    }
  };

  return (
    <main className="min-h-screen bg-[#03070d] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-100px] h-[450px] w-[450px] rounded-full bg-blue-500/[0.05] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        {/* Back */}
        <Link
          href="/labs"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-white"
        >
          <span>←</span>
          <span>Labs</span>
        </Link>

        {/* Hero */}
        <section className="mb-10">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              FREE
            </span>

            <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-400">
              NETWORKING
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              15 ROOMS
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Network Discovery
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-gray-400 md:text-lg">
            Tarmoq qurilmalari, portlar, servislar, DNS, trafik va network
            security tushunchalarini amaliy lablar orqali bosqichma-bosqich
            o‘rganing.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Rooms
              </p>
              <p className="mt-1 text-xl font-bold">15</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Free
              </p>
              <p className="mt-1 text-xl font-bold text-emerald-400">
                {freeRooms}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                PRO
              </p>
              <p className="mt-1 text-xl font-bold text-blue-400">
                {proRooms}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Progress
              </p>
              <p className="mt-1 text-xl font-bold">0 / 15</p>
            </div>
          </div>
        </section>

        {/* Section header */}
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              Learning path
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              15 ta amaliy xona
            </h2>
          </div>

          <div className="hidden text-right text-sm text-gray-500 md:block">
            1 Free · 14 PRO
          </div>
        </div>

        {/* Rooms */}
        <section className="space-y-4">
          {ROOMS.map((room) => {
            return (
              <div
                key={room.id}
                className={`group relative overflow-hidden rounded-3xl border transition ${
                  room.isFree
                    ? "border-emerald-400/15 bg-emerald-400/[0.025] hover:border-emerald-400/30"
                    : "border-white/[0.08] bg-white/[0.018] hover:border-blue-400/20"
                }`}
              >
                <div className="p-5 md:p-7">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                    {/* Number */}
                    <div className="flex shrink-0 items-center gap-4 lg:w-[90px] lg:flex-col lg:items-start">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                        ROOM
                      </span>

                      <span className="text-3xl font-black text-gray-300">
                        {String(room.id).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Main info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {room.isFree ? (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            FREE
                          </span>
                        ) : (
                          <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                            PRO
                          </span>
                        )}

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            DIFFICULTY_STYLES[room.difficulty]
                          }`}
                        >
                          {room.difficulty}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-bold text-white transition group-hover:text-blue-300 md:text-2xl">
                        {room.title}
                      </h3>

                      <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                        {room.description}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-gray-500">
                        <span>
                          <strong className="text-gray-300">
                            {room.tasks}
                          </strong>{" "}
                          tasks
                        </span>

                        <span>
                          <strong className="text-blue-400">
                            +{room.xp}
                          </strong>{" "}
                          XP
                        </span>

                        <span>Networking</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0">
                      {room.isFree && room.slug ? (
                        <Link
                          href={`/labs/network-discovery/${room.slug}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-6 py-3 text-sm font-bold text-emerald-300 transition hover:border-emerald-400/40 hover:bg-emerald-400/15 lg:w-auto"
                        >
                          Start Room
                          <span>→</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => openRoom(room)}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-400/20 bg-blue-500/[0.08] px-6 py-3 text-sm font-bold text-blue-300 transition hover:border-blue-400/40 hover:bg-blue-500/[0.14] lg:w-auto"
                        >
                          <span>🔒</span>
                          PRO
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom progress line */}
                <div className="h-px w-full bg-white/[0.04]" />
                <div className="h-1 w-0 bg-blue-500/60 transition-all duration-500 group-hover:w-8" />
              </div>
            );
          })}
        </section>

        {/* PRO CTA */}
        <section className="mt-12 overflow-hidden rounded-3xl border border-blue-500/15 bg-gradient-to-br from-blue-500/[0.10] via-[#07101b] to-transparent p-7 md:p-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-300">
                CyberForge PRO
              </div>

              <h2 className="text-2xl font-black md:text-3xl">
                14 ta PRO xona sizni kutmoqda
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                Port discoverydan boshlab network security challengegacha
                bo‘lgan barcha amaliy xonalarni oching.
              </p>
            </div>

            <button
              onClick={() =>
                setSelectedProRoom({
                  id: 0,
                  title: "CyberForge PRO",
                  description:
                    "PRO obuna orqali barcha PRO xonalarga kirish mumkin.",
                  difficulty: "Advanced",
                  tasks: 0,
                  xp: 0,
                  isFree: false,
                })
              }
              className="shrink-0 rounded-2xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(37,99,235,0.20)] transition hover:bg-blue-500"
            >
              PRO ni ko‘rish
            </button>
          </div>
        </section>
      </div>

      {/* SIMPLE PRO MODAL */}
      {selectedProRoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setSelectedProRoom(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#07101a] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  PRO
                </span>

                <h2 className="mt-2 text-xl font-bold text-white">
                  {selectedProRoom.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedProRoom(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Yopish"
              >
                ×
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Bu xona faqat CyberForge PRO foydalanuvchilari uchun mavjud.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedProRoom(null)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5"
              >
                Yopish
              </button>

              <Link
                href="/pricing"
                onClick={() => setSelectedProRoom(null)}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-500"
              >
                PRO olish
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}