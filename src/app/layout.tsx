import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeInitializer } from "@/components/glimoka/ThemeInitializer";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GLIMOKA | مجوهرات شخصية فاخرة — أساور وقلائد بأسماء مخصصة",
  description:
    "GLIMOKA — متجر مجوهرات إلكتروني فاخر متخصص في المجوهرات الشخصية المخصصة. أساور وقلائد وخواتم بأسمائك. الدفع عند الاستلام. شحن لكل مصر.",
  keywords: [
    "مجوهرات",
    "أساور بأسماء",
    "قلائد مخصصة",
    "GLIMOKA",
    "مجوهرات مصر",
    "هدايا شخصية",
    "خواتم مخصصة",
  ],
  authors: [{ name: "GLIMOKA" }],
  openGraph: {
    title: "GLIMOKA | مجوهرات شخصية فاخرة",
    description: "أساور وقلائد وخواتم بأسماء مخصصة. الدفع عند الاستلام.",
    siteName: "GLIMOKA",
    type: "website",
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "GLIMOKA | مجوهرات شخصية فاخرة",
    description: "أساور وقلائد وخواتم بأسماء مخصصة. الدفع عند الاستلام.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-theme="light" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeInitializer />
        {children}
        <Toaster />
        <SonnerToaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: "var(--font-cairo), sans-serif",
              borderRadius: "12px",
              border: "1px solid rgba(201, 168, 124, 0.3)",
              boxShadow: "0 10px 40px -4px rgba(106, 27, 53, 0.20)",
            },
            classNames: {
              success: "bg-emerald-50 border-emerald-200 text-emerald-800",
              error: "bg-red-50 border-red-200 text-red-800",
              warning: "bg-amber-50 border-amber-200 text-amber-800",
              info: "bg-cream border-rose-gold/30 text-warm-black",
            },
          }}
        />
      </body>
    </html>
  );
}
