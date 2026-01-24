import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Parisienne, Playfair_Display } from "next/font/google";
import { cookies } from "next/headers";
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

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ana & Rafael - Notre Mariage",
  description: "Rejoignez-nous pour célébrer notre union le 15 août 2026",
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d4af37" },
    { media: "(prefers-color-scheme: dark)", color: "#d4af37" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  
  // Vérifier si l'utilisateur est connecté en tant qu'admin
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_auth_token");

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${parisienne.variable} ${playfairDisplay.variable} antialiased min-h-screen flex flex-col`}
      >
        <PWAInit />
        <I18nProvider locale={locale} dict={dict}>
          <ConfigWarning />
          <Navbar isAdmin={isAdmin} />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
