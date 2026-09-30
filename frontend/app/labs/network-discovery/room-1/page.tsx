"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type DeviceId = "client" | "switch" | "server" | "gateway";

type Device = {
  id: DeviceId;
  name: string;
  type: string;
  icon: string;
  ip: string;
};

type Connection = {
  from: DeviceId;
  to: DeviceId;
};

const DEVICES: Device[] = [
  {
    id: "client",
    name: "CLIENT-01",
    type: "Workstation",
    icon: "▣",
    ip: "192.168.1.10",
  },
  {
    id: "switch",
    name: "SW-01",
    type: "Network Switch",
    icon: "◇",
    ip: "192.168.1.2",
  },
  {
    id: "server",
    name: "WEB-01",
    type: "Web Server",
    icon: "▤",
    ip: "192.168.1.20",
  },
  {
    id: "gateway",
    name: "GW-01",
    type: "Gateway",
    icon: "◎",
    ip: "192.168.1.1",
  },
];

const INITIAL_CONNECTIONS: Connection[] = [
  { from: "switch", to: "server" },
  { from: "switch", to: "gateway" },
];

const POSITIONS: Record<DeviceId, { left: string; top: string }> = {
  client: { left: "15%", top: "50%" },
  switch: { left: "43%", top: "50%" },
  server: { left: "72%", top: "30%" },
  gateway: { left: "72%", top: "72%" },
};

const TASKS = [
  {
    number: "01",
    title: "Network topology'ni aniqlang",
    description:
      "Sizga kichik korxonaning tarmoq topologiyasi berildi. Avval tarmoqdagi qurilmalarni aniqlang va ular qanday bog‘langanini tushuning.",
    steps: [
      "CLIENT-01 qurilmasini toping.",
      "SW-01 qurilmasini toping.",
      "WEB-01 serverini toping.",
    ],
    action: "inspect",
    xp: 10,
  },
  {
    number: "02",
    title: "CLIENT-01 IP manzilini aniqlang",
    description:
      "Tarmoqdagi client kompyuterning IP manzilini toping. Buning uchun CLIENT-01 qurilmasini tanlang.",
    steps: [
      "CLIENT-01 qurilmasini bosing.",
      "DEVICE INFO panelidan IP manzilni toping.",
    ],
    action: "client-ip",
    xp: 10,
  },
  {
    number: "03",
    title: "CLIENT-01 ni SW-01 ga ulang",
    description:
      "Client kompyuter tarmoqqa hali ulanmagan. Uni SW-01 switch orqali tarmoqqa qo‘shing.",
    steps: [
      "CONNECT MODE'ni yoqing.",
      "CLIENT-01 ni tanlang.",
      "SW-01 ni tanlang.",
    ],
    action: "connect",
    xp: 10,
  },
  {
    number: "04",
    title: "WEB-01 serverini aniqlang",
    description:
      "Endi tarmoqdagi web serverni toping va uning IP manzilini aniqlang.",
    steps: [
      "WEB-01 serverini bosing.",
      "DEVICE INFO panelini tekshiring.",
      "Server IP manzilini aniqlang.",
    ],
    action: "server-ip",
    xp: 10,
  },
  {
    number: "05",
    title: "WEB-01 ga ping yuboring",
    description:
      "Tarmoq konfiguratsiyasi tayyor. Endi CLIENT-01 dan WEB-01 serveriga ping yuborib, ular o‘rtasidagi aloqa ishlayotganini tekshiring.",
    steps: [
      "PING WEB-01 tugmasini bosing.",
      "Javob paketlarini kuting.",
      "0% packet loss bo‘lishi kerak.",
    ],
    action: "ping",
    xp: 10,
  },
];

export default function NetworkDiscoveryRoom1() {
  const [selectedDeviceId, setSelectedDeviceId] =
    useState<DeviceId | null>(null);

  const [connections, setConnections] =
    useState<Connection[]>(INITIAL_CONNECTIONS);

  const [connectMode, setConnectMode] = useState(false);

  const [connectSource, setConnectSource] =
    useState<DeviceId | null>(null);

  const [currentTask, setCurrentTask] = useState(1);

  const [completedTasks, setCompletedTasks] =
    useState<number[]>([]);

  const [consoleLines, setConsoleLines] =
    useState<string[]>([
      "CyberForge Network Console v1.0",
      "Lab environment initialized.",
      "Target: 192.168.1.0/24",
      "Waiting for task...",
    ]);

  const [pinging, setPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);

  const selectedDevice = useMemo(
    () =>
      DEVICES.find(
        (device) => device.id === selectedDeviceId
      ) ?? null,
    [selectedDeviceId]
  );

  const task = TASKS[currentTask - 1];

  const progress =
    (completedTasks.length / TASKS.length) * 100;

  function finishTask(taskNumber: number) {
    if (completedTasks.includes(taskNumber)) {
      return;
    }

    setCompletedTasks((previous) => [
      ...previous,
      taskNumber,
    ]);

    if (taskNumber < TASKS.length) {
      setCurrentTask(taskNumber + 1);
    }
  }

  function selectDevice(id: DeviceId) {
    if (connectMode) {
      if (!connectSource) {
        setConnectSource(id);

        setConsoleLines((previous) => [
          ...previous,
          `> Source selected: ${id.toUpperCase()}`,
          "> Select destination device...",
        ]);

        return;
      }

      if (connectSource === id) {
        setConnectSource(null);
        return;
      }

      const exists = connections.some(
        (connection) =>
          (connection.from === connectSource &&
            connection.to === id) ||
          (connection.from === id &&
            connection.to === connectSource)
      );

      if (!exists) {
        setConnections((previous) => [
          ...previous,
          {
            from: connectSource,
            to: id,
          },
        ]);

        setConsoleLines((previous) => [
          ...previous,
          `> Link created: ${connectSource.toUpperCase()} ↔ ${id.toUpperCase()}`,
          "> Link status: UP",
        ]);

        if (
          task.action === "connect" &&
          ((connectSource === "client" &&
            id === "switch") ||
            (connectSource === "switch" &&
              id === "client"))
        ) {
          finishTask(3);
        }
      }

      setConnectSource(null);
      return;
    }

    setSelectedDeviceId(id);

    setConsoleLines((previous) => [
      ...previous,
      `> Device selected: ${id.toUpperCase()}`,
    ]);

    if (task.action === "inspect") {
      finishTask(1);
    }

    if (
      task.action === "client-ip" &&
      id === "client"
    ) {
      finishTask(2);
    }

    if (
      task.action === "server-ip" &&
      id === "server"
    ) {
      finishTask(4);
    }
  }

  function runPing() {
    if (pinging) {
      return;
    }

    setPinging(true);
    setPingSuccess(false);

    setConsoleLines((previous) => [
      ...previous,
      "",
      "> ping 192.168.1.20",
      "> Sending packets...",
    ]);

    setTimeout(() => {
      setConsoleLines((previous) => [
        ...previous,
        "64 bytes from 192.168.1.20: time=2ms",
      ]);
    }, 500);

    setTimeout(() => {
      setConsoleLines((previous) => [
        ...previous,
        "64 bytes from 192.168.1.20: time=1ms",
      ]);
    }, 900);

    setTimeout(() => {
      setConsoleLines((previous) => [
        ...previous,
        "64 bytes from 192.168.1.20: time=2ms",
        "",
        "--- Ping statistics ---",
        "3 packets transmitted",
        "3 packets received",
        "0% packet loss",
        "",
        "NETWORK CONNECTION SUCCESS",
      ]);

      setPinging(false);
      setPingSuccess(true);

      if (task.action === "ping") {
        finishTask(5);
      }
    }, 1400);
  }

  function resetLab() {
    setSelectedDeviceId(null);
    setConnections(INITIAL_CONNECTIONS);
    setConnectMode(false);
    setConnectSource(null);
    setCurrentTask(1);
    setCompletedTasks([]);
    setPinging(false);
    setPingSuccess(false);

    setConsoleLines([
      "CyberForge Network Console v1.0",
      "Lab environment initialized.",
      "Target: 192.168.1.0/24",
      "Waiting for task...",
    ]);
  }

  return (
    <main className="min-h-screen bg-[#02060b] text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-600/[0.07] blur-[150px]" />

        <div className="absolute bottom-[-250px] right-[-150px] h-[500px] w-[500px] rounded-full bg-blue-500/[0.04] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1550px] px-3 py-4 sm:px-5 lg:px-7">

        {/* HEADER */}
        <header className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/labs/network-discovery"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-500 transition hover:border-blue-500/30 hover:text-white"
            >
              ←
            </Link>

            <div>
              <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                <span>NETWORK DISCOVERY</span>
                <span>/</span>
                <span className="text-blue-400">
                  ROOM 01
                </span>
              </div>

              <h1 className="mt-1 text-sm font-bold sm:text-base">
                Network Reconnaissance
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[8px] uppercase tracking-[0.18em] text-gray-600">
                PROGRESS
              </p>

              <p className="mt-1 text-xs font-bold text-gray-300">
                {completedTasks.length}/{TASKS.length}
              </p>
            </div>

            <div className="h-2 w-28 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.6)] transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <button
              type="button"
              onClick={resetLab}
              className="rounded-xl border border-white/10 px-3 py-2 text-[9px] font-bold text-gray-500 transition hover:bg-white/[0.04] hover:text-white"
            >
              RESET
            </button>
          </div>
        </header>

        {/* TASK CARD */}
        <section className="relative mb-4 overflow-hidden rounded-[26px] border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.08] via-white/[0.025] to-transparent shadow-[0_0_60px_rgba(37,99,235,0.06)]">
          <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.7)]" />

          <div className="relative p-6 sm:p-8 lg:p-9">
            <div className="flex flex-col gap-7 lg:flex-row lg:justify-between">

              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-blue-400">
                    TASK {task.number}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                    NETWORKING
                  </span>

                  <span className="rounded-full border border-green-500/20 bg-green-500/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-green-400">
                    +{task.xp} XP
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  {task.title}
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400 sm:text-[15px]">
                  {task.description}
                </p>

                <div className="mt-6">
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                    VAZIFA
                  </p>

                  <div className="space-y-2">
                    {task.steps.map((step, index) => (
                      <div
                        key={step}
                        className="flex items-start gap-3"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-[9px] font-bold text-gray-500">
                          {index + 1}
                        </span>

                        <p className="text-xs leading-5 text-gray-500">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full shrink-0 lg:w-[240px]">
                <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                    LAB PROGRESS
                  </p>

                  <div className="mt-4 flex items-end justify-between">
                    <p className="text-3xl font-bold">
                      {completedTasks.length}
                      <span className="text-gray-700">
                        /{TASKS.length}
                      </span>
                    </p>

                    <p className="text-xs text-blue-400">
                      {Math.round(progress)}%
                    </p>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <p className="mt-4 text-[10px] leading-5 text-gray-600">
                    Tasklarni ketma-ket bajaring.
                    Har bir muvaffaqiyatli task XP beradi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SIMULATOR */}
        <div className="grid gap-3 xl:grid-cols-[200px_minmax(0,1fr)_260px]">

          {/* LAB OBJECTS */}
          <aside className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
            <p className="px-2 pb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
              LAB OBJECTS
            </p>

            <div className="space-y-2">
              {DEVICES.map((device) => (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => selectDevice(device.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    selectedDeviceId === device.id
                      ? "border-blue-500/30 bg-blue-500/[0.08]"
                      : "border-white/[0.07] bg-white/[0.015] hover:border-white/15 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/20 text-sm text-blue-400">
                      {device.icon}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-bold text-gray-300">
                        {device.name}
                      </p>

                      <p className="mt-1 truncate text-[8px] text-gray-600">
                        {device.type}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="my-4 h-px bg-white/[0.06]" />

            <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
              <p className="text-[8px] uppercase tracking-[0.18em] text-gray-600">
                TARGET NETWORK
              </p>

              <p className="mt-2 font-mono text-[10px] text-blue-400">
                192.168.1.0/24
              </p>
            </div>
          </aside>

          {/* NETWORK SIMULATOR */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#030911]">

            <div className="flex flex-col gap-3 border-b border-white/[0.07] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-400">
                  NETWORK SIMULATOR
                </p>

                <p className="mt-1 text-[10px] text-gray-600">
                  Interactive topology
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setConnectMode((value) => !value);
                    setConnectSource(null);
                  }}
                  className={`rounded-lg border px-3 py-2 text-[9px] font-bold uppercase tracking-wider transition ${
                    connectMode
                      ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                      : "border-white/10 bg-white/[0.03] text-gray-500 hover:text-white"
                  }`}
                >
                  {connectMode
                    ? "SELECT DEVICE"
                    : "CONNECT"}
                </button>

                <button
                  type="button"
                  onClick={runPing}
                  disabled={pinging}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-white transition hover:bg-blue-500 disabled:opacity-50"
                >
                  {pinging
                    ? "PING..."
                    : "PING WEB-01"}
                </button>
              </div>
            </div>

            {/* TOPOLOGY */}
            <div className="relative min-h-[470px] overflow-hidden bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.045),transparent_58%)] sm:min-h-[560px]">

              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* CONNECTIONS */}
              {connections.map((connection) => {
                const from =
                  POSITIONS[connection.from];

                const to =
                  POSITIONS[connection.to];

                return (
                  <svg
                    key={`${connection.from}-${connection.to}`}
                    className="pointer-events-none absolute inset-0 h-full w-full"
                  >
                    <line
                      x1={from.left}
                      y1={from.top}
                      x2={to.left}
                      y2={to.top}
                      stroke="rgba(59,130,246,0.35)"
                      strokeWidth="2"
                      strokeDasharray="7 7"
                    />

                    <line
                      x1={from.left}
                      y1={from.top}
                      x2={to.left}
                      y2={to.top}
                      stroke="rgba(59,130,246,0.10)"
                      strokeWidth="8"
                    />
                  </svg>
                );
              })}

              {/* CONNECT HINT */}
              {connectMode && (
                <div className="absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border border-blue-500/20 bg-blue-500/[0.08] px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-blue-400 backdrop-blur-md">
                  {connectSource
                    ? "Ikkinchi qurilmani tanlang"
                    : "Birinchi qurilmani tanlang"}
                </div>
              )}

              {/* DEVICES */}
              {DEVICES.map((device) => {
                const position =
                  POSITIONS[device.id];

                const selected =
                  selectedDeviceId === device.id;

                const source =
                  connectSource === device.id;

                return (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() =>
                      selectDevice(device.id)
                    }
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: position.left,
                      top: position.top,
                    }}
                  >
                    <div
                      className={`w-[125px] rounded-2xl border p-3 transition sm:w-[145px] ${
                        selected || source
                          ? "border-blue-500/50 bg-blue-500/[0.10] shadow-[0_0_35px_rgba(37,99,235,0.16)]"
                          : "border-white/10 bg-[#07101a] hover:border-blue-500/30"
                      }`}
                    >
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/15 bg-blue-500/[0.05] text-lg text-blue-400">
                        {device.icon}
                      </div>

                      <p className="mt-3 text-[10px] font-bold text-gray-300">
                        {device.name}
                      </p>

                      <p className="mt-1 font-mono text-[8px] text-gray-600">
                        {device.ip}
                      </p>

                      <div className="mt-2 flex items-center justify-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_7px_rgba(74,222,128,0.8)]" />

                        <span className="text-[8px] uppercase tracking-wider text-gray-600">
                          online
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}

              {pinging && (
                <div className="absolute left-[43%] top-[49%] h-4 w-4 animate-ping rounded-full bg-blue-400/70" />
              )}

              {pingSuccess && (
                <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-xl border border-green-500/20 bg-green-500/[0.08] px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-green-400 backdrop-blur-md">
                  Connection established
                </div>
              )}
            </div>

            {/* CONSOLE */}
            <div className="border-t border-white/[0.07] bg-[#020509]">
              <div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-2.5">
                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-gray-600">
                  NETWORK CONSOLE
                </span>

                <span className="font-mono text-[8px] text-green-500/70">
                  online
                </span>
              </div>

              <div className="h-36 overflow-y-auto p-4 font-mono text-[9px] leading-5">
                {consoleLines.map((line, index) => (
                  <div
                    key={`${line}-${index}`}
                    className={
                      line.includes("SUCCESS")
                        ? "text-green-400"
                        : line.startsWith(">")
                          ? "text-blue-400"
                          : "text-gray-600"
                    }
                  >
                    {line || "\u00A0"}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* DEVICE INFO */}
          <aside className="space-y-3">

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                DEVICE INFO
              </p>

              {selectedDevice ? (
                <div className="mt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                      {selectedDevice.icon}
                    </div>

                    <div>
                      <p className="text-xs font-bold">
                        {selectedDevice.name}
                      </p>

                      <p className="mt-1 text-[8px] text-gray-600">
                        {selectedDevice.type}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <Info
                      label="IP ADDRESS"
                      value={selectedDevice.ip}
                    />

                    <Info
                      label="STATUS"
                      value="ONLINE"
                      valueClass="text-green-400"
                    />

                    <Info
                      label="NETWORK"
                      value="192.168.1.0/24"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-white/[0.08] p-5 text-center">
                  <p className="text-[10px] text-gray-600">
                    Qurilmani tanlang
                  </p>
                </div>
              )}
            </div>

            {/* ACTIVE LINKS */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                ACTIVE LINKS
              </p>

              <div className="mt-4 space-y-2">
                {connections.map((connection) => (
                  <div
                    key={`${connection.from}-${connection.to}`}
                    className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-black/20 px-3 py-2"
                  >
                    <span className="font-mono text-[8px] text-gray-500">
                      {connection.from.toUpperCase()}
                    </span>

                    <span className="text-[9px] text-blue-400">
                      ↔
                    </span>

                    <span className="font-mono text-[8px] text-gray-500">
                      {connection.to.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* REWARD */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                ROOM REWARD
              </p>

              <p className="mt-3 text-2xl font-bold text-blue-400">
                +50 XP
              </p>

              <p className="mt-1 text-[9px] leading-5 text-gray-600">
                5 ta taskni muvaffaqiyatli yakunlang.
              </p>
            </div>
          </aside>
        </div>

        {/* COMPLETION */}
        {completedTasks.length === TASKS.length && (
          <section className="mt-4 overflow-hidden rounded-3xl border border-blue-500/25 bg-gradient-to-br from-blue-500/[0.10] via-white/[0.02] to-transparent p-7 shadow-[0_0_60px_rgba(37,99,235,0.10)] sm:p-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-400">
                    ✓
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-400">
                      ROOM COMPLETE
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Network Reconnaissance completed
                    </h2>
                  </div>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500">
                  Birinchi network room muvaffaqiyatli yakunlandi.
                  Endi portlar va xizmatlarni aniqlash kabi
                  keyingi amaliyotlarga o‘tishingiz mumkin.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-8 py-5 text-center">
                <p className="text-3xl font-bold text-blue-400">
                  +50 XP
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-gray-600">
                  TOTAL REWARD
                </p>
              </div>
            </div>

            <div className="mt-7 h-px bg-white/10" />

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/labs/network-discovery"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center text-sm font-semibold text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                ← Lab overview
              </Link>

              <button
                type="button"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
                onClick={() =>
                  alert("Room 02 — Port Discovery PRO")
                }
              >
                Keyingi Room →
              </button>
            </div>
          </section>
        )}

        <footer className="py-8 text-center">
          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-700">
            CyberForge Labs · Learn by doing
          </p>
        </footer>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
  valueClass = "text-gray-300",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.05] pb-2">
      <span className="text-[8px] uppercase tracking-wider text-gray-600">
        {label}
      </span>

      <span
        className={`font-mono text-[9px] ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}