import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import ToastContainer from "@/components/ToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CSTech",
  description: "Agentic flow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="p-6 max-w-7xl mx-auto w-full">{children}</main>
              <footer className="text-center text-xs text-slate-400 py-6">© {new Date().getFullYear()}</footer>
            </div>
          </div>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
