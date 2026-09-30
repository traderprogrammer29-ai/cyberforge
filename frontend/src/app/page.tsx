import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-blue-400">
          CyberForge
        </h1>

        <p className="mt-4 text-zinc-400">
          Learn. Practice. Challenge. Master.
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-blue-500 px-5 py-3"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-white/10 px-5 py-3"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}