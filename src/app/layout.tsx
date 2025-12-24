import type { Metadata } from "next";
import { Geist, Geist_Mono, Parisienne } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ConfigWarning } from "@/components/ui/ConfigWarning";
import PWAInit from "@/components/pwa/PWAInit";
import { I18nProvider } from "@/lib/i18n/context";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const parisienne = Parisienne({
  variable: "--font-parisienne",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ana & Rafael - Notre Mariage",
  description: "Rejoignez-nous pour célébrer notre union le 15 Août 2026",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ana & Rafael - Mariage",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#d4af37",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${parisienne.variable} antialiased min-h-screen flex flex-col`}
      >
        <PWAInit />
        <I18nProvider locale={locale} dict={dict}>
          <ConfigWarning />
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
