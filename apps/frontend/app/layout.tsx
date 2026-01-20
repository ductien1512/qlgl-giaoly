import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Giáo lý",
  description: "Quản lý học sinh, lớp học và điểm danh giáo lý",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ReactQueryProvider>
          {children}
          <Toaster 
            position="top-right"
            richColors
            closeButton
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}