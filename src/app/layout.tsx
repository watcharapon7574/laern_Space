import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "คลังเก็บสื่อการสอน",
  description: "คลังเก็บสื่อการสอนออนไลน์สำหรับนักเรียน ครู และผู้ปกครอง",
  keywords: "สื่อการสอน, เกมการศึกษา, วิทยาศาสตร์, คณิตศาสตร์, ภาษาไทย, ภาษาอังกฤษ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
