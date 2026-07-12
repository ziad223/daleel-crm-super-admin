import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { DataProvider } from "@/lib/context/DataContext";
import { Toaster } from "sonner";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daleel CRM | Super Admin",
  description: "Super Admin Dashboard - Daleel Al Sharq CRM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-[#F1F5F9] antialiased">
        <LanguageProvider>
          <DataProvider>
            {children}
          </DataProvider>
          <Toaster position="top-center" richColors closeButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
