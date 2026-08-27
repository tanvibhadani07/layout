import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {

  description: "A clean, minimal dashboard layout built with Next.js and Tailwind CSS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="w-full h-full">
      <body className="w-full h-full bg-slate-100 antialiased">
        <div className="flex w-full min-h-full items-stretch justify-center bg-slate-100 ">
          <div className="flex w-full  flex-col overflow-hidden border-gray-200 bg-white shadow-sm md:flex-row ">
            <Sidebar />
            <main className="flex min-h-0 min-w-0 flex-1 flex-col">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
