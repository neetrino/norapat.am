import type { Metadata } from "next";
import { Caveat, Inter, Permanent_Marker } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import DeferredClientDecorations from "@/components/DeferredClientDecorations";
import DeferredPullToRefresh from "@/components/DeferredPullToRefresh";
import MobileBottomNav from "@/components/MobileBottomNav";
import Header from "@/components/Header";
import { HeaderStackProvider } from "@/contexts/HeaderStackContext";
import { fetchPublicSiteSettings } from "@/lib/publicSiteSettings";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://norapat.am"
  ),
  title: "NORAPAT - երբ ուզում եք ուտել համեղ",
  description:
    "Բազմազան ուտեստների լայն ընտրանի, որտեղ յուրաքանչյուրը կգտնի իր սիրելի տարբերակը։",
  keywords: "NORAPAT, պիդե, հայկական պիդե, մինի պիցցա, ուտելիքի առաքում, Երևան, Հայաստան",
  icons: {
    icon: [{ url: "/icon/norapat.svg", type: "image/svg+xml" }],
    shortcut: "/icon/norapat.svg",
    apple: "/icon/norapat.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publicSiteSettings = await fetchPublicSiteSettings();

  return (
    <html lang="hy" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${promoCaveat.variable} ${promoMarker.variable} font-sans antialiased overflow-visible`}
      >
        <DeferredClientDecorations />
        <ClientProviders initialPublicSiteSettings={publicSiteSettings}>
          <HeaderStackProvider>
            <Header />
            <DeferredPullToRefresh>
              {children}
            </DeferredPullToRefresh>
            <MobileBottomNav />
          </HeaderStackProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
