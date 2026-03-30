import type { Metadata } from "next";
import { Caveat, Inter, Permanent_Marker } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import MobileBottomNav from "@/components/MobileBottomNav";
import ServiceWorkerProvider from "@/components/ServiceWorkerProvider";
import PullToRefresh from "@/components/PullToRefresh";
import Header from "@/components/Header";
import FloatingCallWidget from "@/components/FloatingCallWidget";
import { HeaderStackProvider } from "@/contexts/HeaderStackContext";

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
  title: "NORAPAT — հայկական պիդե, նոր համ",
  description:
    "Ավանդական ձև՝ ժամանակակից լցոնումներով։ 15 եզակի համ իրական գուրմանների համար։ Առաքում Երևանում։",
  keywords: "NORAPAT, պիդե, հայկական պիդե, մինի պիցցա, ուտելիքի առաքում, Երևան, Հայաստան",
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
          <HeaderStackProvider>
            <Header />
            <PullToRefresh>
              {children}
            </PullToRefresh>
            <FloatingCallWidget />
            <MobileBottomNav />
          </HeaderStackProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
