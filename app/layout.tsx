import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import LogoutButton from "./components/LogoutButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Todo list app",
  description: "Cool todo list app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col">
        <main className="max-w-[1040px] w-full mx-auto p-5">
          <header className="flex items-center justify-between gap-4 mb-5">
            <div className="text-2xl font-extrabold tracking-wide font-display">Cool Todolist</div>
            <nav className="flex gap-3">
              <a className="link" href="/">
                Home
              </a>
              <a className="link" href="/protected">
                Protected Page
              </a>
              <LogoutButton />
            </nav>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
