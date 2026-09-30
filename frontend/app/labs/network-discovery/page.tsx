
"use client";

import Link from "next/link";
import { useState } from "react";

const rooms = [
  {
    id: 1,
    title: "Network Reconnaissance",
    description:
      "IP manzil, localhost va tarmoq tushunchalarini amaliy topshiriqlar orqali o‘rganing.",
    tasks: 5,
    xp: 50,
    status: "free",
  },
  {
    id: 2,
    title: "Port Discovery",
    description:
      "Portlar, xizmatlar va ochiq portlarni aniqlash jarayonini amaliy muhitda o‘rganing.",
    tasks: 7,
    xp: 50,
    status: "pro",
  },
  {
    id: 3,
    title: "Network Enumeration",
    description:
      "Tarmoqdagi qurilmalar va xizmatlarni chuqurroq tekshirish usullarini o‘rganing.",
    tasks: 8,
    xp: 50,
    status: "pro",
  },
];

export default function NetworkDiscoveryPage() {
  const [showProModal, setShowProModal] = useState(false);

  return (
    <main className="min-h-screen bg-[#02060b] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[130px]" />
        <div className="absolute bottom-[-250px] right-[-150px] h-[500px] w-[500px] rounded-full bg-blue-500/[0.05] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Top navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/labs"
            className="group inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-white"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Barcha Labs
          </Link>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>LABS</span>
            <span>/</span>
            <span className="text-gray-400">NETWORK DISCOVERY</span>
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.07] via-transparent to-transparent" />

          <div className="relative p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-green-500/20 bg-green-500/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-green-400">
                    FREE LAB
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                    BEGINNER
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                    NETWORKING
                  </span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Network{" "}
                  <span className="text-blue-400 [text-shadow:0_0_30px_rgba(59,130,246,0.35)]">
                    Discovery
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                  Tarmoq, IP manzillar, portlar va xizmatlarni amaliy muhitda
                  o‘rganing. Birinchi room bepul — qolgan amaliyotlarni PRO
                  orqali ochishingiz mumkin.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-5 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-blue-400">◆</span>
                    <span>3 Rooms</span>
                  </div>

                  <div className="h-4 w-px bg-white/10" />

                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-blue-400">⚡</span>
                    <span>150 XP</span>
                  </div>

                  <div className="h-4 w-px bg-white/10" />

                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-green-400">●</span>
                    <span>1 Free Room</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="w-full shrink-0 lg:w-[290px]">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
                        YOUR PROGRESS
                      </p>

                      <p className="mt-2 text-3xl font-bold">
                        0
                        <span className="text-gray-600">/3</span>
                      </p>
                    </div>

                    <span className="text-xs text-gray-500">0%</span>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-0 rounded-full bg-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.6)]" />
                  </div>

                  <p className="mt-4 text-xs leading-5 text-gray-600">
                    Birinchi roomni yakunlab progressni boshlang.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rooms */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400">
                LAB ROOMS
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Amaliy bosqichlar
              </h2>
            </div>

            <p className="text-sm text-gray-600">
              1 ta room bepul · 2 ta PRO
            </p>
          </div>

          <div className="space-y-4">
            {rooms.map((room) => {
              const isFree = room.status === "free";

              if (isFree) {
                return (
                  <Link
                    key={room.id}
                    href="/labs/network-discovery/room-1"
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-blue-500/[0.035] transition duration-300 hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-blue-500/[0.055] hover:shadow-[0_0_45px_rgba(37,99,235,0.08)]">
                      <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.7)]" />

                      <div className="p-5 sm:p-7">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center">
                          <div className="flex min-w-0 flex-1 gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-sm font-bold text-blue-400">
                              01
                            </div>

                            <div className="min-w-0">
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-green-500/20 bg-green-500/[0.08] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-green-400">
                                  FREE
                                </span>

                                <span className="text-[10px] uppercase tracking-wider text-gray-600">
                                  START HERE
                                </span>
                              </div>

                              <h3 className="text-lg font-bold text-white transition group-hover:text-blue-300 sm:text-xl">
                                {room.title}
                              </h3>

                              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                                {room.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center justify-between gap-5 border-t border-white/5 pt-5 md:border-t-0 md:pt-0">
                            <div className="text-left md:text-right">
                              <p className="text-xs text-gray-600">
                                {room.tasks} Tasks
                              </p>
                              <p className="mt-1 text-sm font-semibold text-blue-400">
                                +{room.xp} XP
                              </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-500 transition group-hover:border-blue-500/30 group-hover:bg-blue-500/10 group-hover:text-blue-400">
                              →
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }

              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setShowProModal(true)}
                  className="group block w-full text-left"
                >
                  <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.018] transition duration-300 hover:border-blue-500/20 hover:bg-white/[0.025]">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.025] to-transparent opacity-0 transition group-hover:opacity-100" />

                    <div className="relative p-5 sm:p-7">
                      <div className="flex flex-col gap-6 md:flex-row md:items-center">
                        <div className="flex min-w-0 flex-1 gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm font-bold text-gray-600">
                            0{room.id}
                          </div>

                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-blue-500/20 bg-blue-500/[0.07] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-400">
                                PRO
                              </span>

                              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-600">
                                <span>LOCKED</span>
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-300 transition group-hover:text-white sm:text-xl">
                              {room.title}
                            </h3>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                              {room.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-between gap-5 border-t border-white/5 pt-5 md:border-t-0 md:pt-0">
                          <div className="text-left md:text-right">
                            <p className="text-xs text-gray-600">
                              {room.tasks} Tasks
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-500">
                              +{room.xp} XP
                            </p>
                          </div>

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-gray-600 transition group-hover:border-blue-500/20 group-hover:text-blue-400">
                            🔒
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* PRO CTA */}
        <section className="mt-10 overflow-hidden rounded-3xl border border-blue-500/15 bg-gradient-to-br from-blue-500/[0.08] via-white/[0.015] to-transparent">
          <div className="relative p-7 sm:p-9 lg:p-10">
            <div className="absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full bg-blue-500/[0.08] blur-[90px]" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">
                  CYBERFORGE PRO
                </span>

                <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  Keyingi bosqichni oching.
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  Port Discovery, Network Enumeration va boshqa chuqur
                  amaliyotlarni oching. Ko‘proq room, ko‘proq task va ko‘proq
                  XP bilan tajribangizni davom ettiring.
                </p>

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
                  <span>✓ Advanced Labs</span>
                  <span>✓ Ko‘proq XP</span>
                  <span>✓ PRO Content</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowProModal(true)}
                className="shrink-0 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_25px_rgba(37,99,235,0.2)] transition hover:bg-blue-500 hover:shadow-[0_0_35px_rgba(37,99,235,0.3)]"
              >
                PRO haqida ko‘rish →
              </button>
            </div>
          </div>
        </section>

        {/* Bottom */}
        <div className="py-10 text-center">
          <p className="text-xs text-gray-700">
            CyberForge Labs · Learn by doing
          </p>
        </div>
      </div>

      {/* PRO Modal */}
      {showProModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-md"
          onClick={() => setShowProModal(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl border border-blue-500/20 bg-[#070d15] shadow-[0_0_80px_rgba(37,99,235,0.15)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-white/10 p-6 sm:p-7">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                    CYBERFORGE PRO
                  </span>

                  <h3 className="mt-3 text-2xl font-bold">
                    Locked content
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Bu room PRO foydalanuvchilar uchun mavjud.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProModal(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-gray-500 transition hover:bg-white/5 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <div className="space-y-3">
                {[
                  "Advanced networking labs",
                  "Qo‘shimcha amaliy tasklar",
                  "Ko‘proq XP va progress",
                  "PRO cybersecurity content",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3"
                  >
                    <span className="text-blue-400">✓</span>
                    <span className="text-sm text-gray-400">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center text-sm font-semibold text-gray-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Kirish
                </Link>

                <button
                  type="button"
                  className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
                  onClick={() => setShowProModal(false)}
                >
                  PRO ochish →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}