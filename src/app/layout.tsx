import type { Metadata } from "next";
import { Caveat, Inter, Permanent_Marker } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import MobileBottomNav from "@/components/MobileBottomNav";
import ServiceWorkerProvider from "@/components/ServiceWorkerProvider";
import PullToRefresh from "@/components/PullToRefresh";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const promoCaveat = Caveat({
  subsets: ["latin"],
  variable: "--font-promo-caveat",
});

const promoMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-promo-marker",
});

export const metadata: Metadata = {
  title: "Pideh Armenia — հայկական պիդե, նոր համ",
  description:
    "Ավանդական ձև՝ ժամանակակից լցոնումներով։ 15 եզակի համ իրական գուրմանների համար։ Առաքում Երևանում։",
  keywords: "պիդե, հայկական պիդե, մինի պիցցա, ուտելիքի առաքում, Երևան, Հայաստան",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${promoCaveat.variable} ${promoMarker.variable} font-sans antialiased overflow-visible`}
      >
        <ServiceWorkerProvider />
        <ClientProviders>
          <Header />
          <PullToRefresh>
            {children}
          </PullToRefresh>
          <MobileBottomNav />
        </ClientProviders>
      </body>
    </html>
  );
}
