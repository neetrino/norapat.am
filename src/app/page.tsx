import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const DEFAULT_TITLE = "NORAPAT - երբ ուզում եք ուտել համեղ";
const DEFAULT_DESCRIPTION =
  "Բազմազան ուտեստների լայն ընտրանի, որտեղ յուրաքանչյուրը կգտնի իր սիրելի տարբերակը։";

function sanitize(value: string | undefined, maxLen: number): string | undefined {
  if (!value) return undefined;
  try {
    const decoded = decodeURIComponent(value).replace(/<[^>]*>/g, "").trim();
    return decoded.slice(0, maxLen) || undefined;
  } catch {
    return undefined;
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ title?: string; desc?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const title = sanitize(params.title, 60) ?? DEFAULT_TITLE;
  const description = sanitize(params.desc, 160) ?? DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ["/logo.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.png"],
    },
  };
}

export default function Home() {
  return <HomeClient />;
}
