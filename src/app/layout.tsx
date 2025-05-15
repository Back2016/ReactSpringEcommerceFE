import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from 'react-hot-toast'
import { Footer } from "@/components/layout/Footer";
import { CartSyncOnLogin } from "@/components/syncCart/CartSyncOnLogin";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DemoBuy | A NextJS + Spring Boot e-commerce store",
  description: "A modern e-commerce store built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <CartSyncOnLogin />
          {children}
        </main>
        <Toaster position="top-center" />
        <Footer />
      </body>
    </html>
  );
}
