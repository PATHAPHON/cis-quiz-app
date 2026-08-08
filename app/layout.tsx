import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mobile Quiz App - แบบทดสอบ 3 โมดูลพร้อมระบบเรียนซ้ำข้อผิด",
  description: "แอปแบบทดสอบบน Next.js สไตล์แอปมือถือ ตรวจคำตอบทันที และฟีเจอร์เรียนซ้ำเฉพาะข้อที่ตอบผิดจนกว่าจะตอบถูก 100%",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${inter.className} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
