"use client";

import { useEffect, useState } from "react";

type Plan = {
  name: string;
  subtitle: string;
  price: string;
  oldPrice: string | null;
  duration: string;
  popular: boolean;
  pro: boolean;
  button: string;
  features: string[];
  apiPlan?: string;
};

const plans: Plan[] = [
  {
    name: "Free",
    subtitle: "Boshlash uchun",
    price: "0",
    oldPrice: null,
    duration: "Doimiy",
    popular: false,
    pro: false,
    button: "Hozir boshlash",
    features: [
      "Asosiy cybersecurity kurslar",
      "Cheklangan lab xonalari",
      "Quiz va testlar",
      "Asosiy progress",
      "Daily challenge",
    ],
  },
  {
    name: "1 Oy",
    subtitle: "Qisqa muddatli",
    price: "79 000",
    oldPrice: "120 000",
    duration: "1 oy",
    popular: false,
    pro: true,
    button: "1 oylik PRO ni tanlash",
    apiPlan: "1_month",
    features: [
      "Barcha cybersecurity kurslar",
      "Barcha premium lab xonalari",
      "Advanced cybersecurity challenges",
      "Ko‘proq XP va progress",
      "AI Mentor",
    ],
  },
  {
    name: "3 Oy",
    subtitle: "Eng mashhur tanlov",
    price: "169 000",
    oldPrice: "270 000",
    duration: "3 oy",
    popular: true,
    pro: true,
    button: "3 oylik PRO ni tanlash",
    apiPlan: "3_month",
    features: [
      "Barcha cybersecurity kurslar",
      "Barcha premium lab xonalari",
      "Advanced cybersecurity challenges",
      "Ko‘proq XP va progress",
      "AI Mentor",
    ],
  },
  {
    name: "1 Yil",
    subtitle: "Uzoq muddatli",
    price: "599 000",
    oldPrice: "800 000",
    duration: "12 oy",
    popular: false,
    pro: true,
    button: "Yillik PRO ni tanlash",
    apiPlan: "1_year",
    features: [
      "Barcha cybersecurity kurslar",
      "Barcha premium lab xonalari",
      "Advanced cybersecurity challenges",
      "Ko‘proq XP va progress",
      "AI Mentor",
    ],
  },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [mouse, setMouse] = useState({
    x: 50,
    y: 50,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const openPayment = (plan: Plan) => {
    if (!plan.pro) {
      return;
    }

    setSelectedPlan(plan);
  };

  const closePayment = () => {
    setSelectedPlan(null);
  };

  const openTelegram = () => {
    if (!selectedPlan) {
      return;
    }

    const telegramUsername = "khayitboyev_o";

    const text = [
      "Assalomu alaykum.",
      "",
      "Men CyberForge PRO obunasini sotib olmoqchiman.",
      "",
      `Tarif: ${selectedPlan.name}`,
      `Narx: ${selectedPlan.price} so'm`,
      `Muddat: ${selectedPlan.duration}`,
      "",
      "Iltimos, to'lov uchun ma'lumotlarni yuboring.",
    ].join("\n");

    const telegramUrl = `https://t.me/${telegramUsername}?text=${encodeURIComponent(
      text
    )}`;

    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(
              circle at ${mouse.x}% ${mouse.y}%,
              rgba(37,99,235,0.18),
              transparent 35%
            )
          `,
        }}
      />

      {/* Main */}
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            CyberForge PRO
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Kiberxavfsizlikni
            <span className="block text-blue-400">
              professional darajaga olib chiqing
            </span>
          </h1>

          <p className="mt-6 text-base leading-7 text-slate-400 sm:text-lg">
            Kurslar, lablar, challenge va AI Mentor orqali
            amaliy cybersecurity bilimlarini rivojlantiring.
          </p>
        </div>

        {/* Pricing */}
        <div className="mt-14 grid gap-6 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "border-blue-500/50 bg-blue-500/[0.08] shadow-2xl shadow-blue-500/10"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-blue-400/30 bg-blue-500 px-4 py-1 text-xs font-bold">
                  ENG MASHHUR
                </div>
              )}

              <p className="text-sm text-slate-400">
                {plan.subtitle}
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {plan.name}
              </h2>

              <div className="mb-6 mt-5">
                {plan.oldPrice && (
                  <div className="text-sm text-slate-500 line-through">
                    {plan.oldPrice} so'm
                  </div>
                )}

                <div className="mt-1 text-4xl font-black">
                  {plan.price}
                  <span className="ml-1 text-base font-normal text-slate-400">
                    so'm
                  </span>
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  {plan.duration}
                </div>
              </div>

              <div className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex gap-3 text-sm text-slate-300"
                  >
                    <span className="text-blue-400">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => openPayment(plan)}
                className={`mt-8 w-full rounded-xl px-5 py-3.5 text-sm font-bold transition ${
                  plan.pro
                    ? "bg-blue-600 shadow-lg shadow-blue-600/20 hover:bg-blue-500"
                    : "border border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-slate-600">
          PRO to'lovi Telegram orqali admin bilan bog'lanish
          asosida amalga oshiriladi. To'lov tasdiqlangandan
          keyin PRO obuna admin tomonidan faollashtiriladi.
        </div>
      </div>

      {/* TELEGRAM PAYMENT MODAL */}
      {selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md"
          onClick={closePayment}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#07101f] p-5 shadow-2xl shadow-blue-500/10 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={closePayment}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Yopish"
            >
              ×
            </button>

            {/* GORIZONTAL CONTENT */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6 sm:pr-10">
              {/* LEFT */}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-blue-400">
                  CyberForge PRO
                </div>

                <h2 className="mt-1 text-xl font-black">
                  PRO obuna
                </h2>

                <div className="mt-4 flex items-center gap-4 rounded-xl border border-blue-500/20 bg-blue-500/[0.05] px-4 py-3">
                  <div>
                    <div className="text-base font-bold">
                      {selectedPlan.name}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {selectedPlan.duration}
                    </div>
                  </div>

                  <div className="ml-auto text-right">
                    <div className="text-lg font-black text-blue-400">
                      {selectedPlan.price}
                    </div>

                    <div className="text-xs text-slate-500">
                      so'm
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="w-full shrink-0 sm:w-[290px]">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#229ED9]/10 text-[#229ED9]">
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M21.9 3.1 18.8 21c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.2-8.3c.4-.4-.1-.6-.6-.2L6.2 14.7l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.6 2c.9-.3 1.7.2 1.3 1.1Z" />
                      </svg>
                    </div>

                    <div>
                      <div className="text-sm font-bold">
                        Telegram orqali to'lov
                      </div>

                      <div className="text-[11px] text-slate-500">
                        @khayitboyev_o
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    To'lov ma'lumotlarini olish uchun admin
                    bilan Telegram orqali bog'laning.
                  </p>

                  <button
                    type="button"
                    onClick={openTelegram}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#229ED9] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/10 transition hover:bg-[#1d8bc1]"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M21.9 3.1 18.8 21c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.2-8.3c.4-.4-.1-.6-.6-.2L6.2 14.7l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.6 2c.9-.3 1.7.2 1.3 1.1Z" />
                    </svg>

                    Telegram orqali murojaat
                  </button>
                </div>
              </div>
            </div>

            {/* BOTTOM */}
            <div className="mt-4 flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-[11px] leading-5 text-slate-600">
                CyberForge karta raqami, CVV yoki OTP kodini
                so‘ramaydi va saqlamaydi. To‘lov admin bilan
                kelishilgan tartibda amalga oshiriladi.
              </p>

              <button
                type="button"
                onClick={closePayment}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}