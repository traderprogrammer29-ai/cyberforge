import type { Metadata } from "next";
import MouseGlow from "./components/MouseGlow";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberForge",
  description: "Cybersecurity Learning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className="min-h-full flex flex-col">
        <MouseGlow />
        {children}
      </body>
    </html>
  );
}