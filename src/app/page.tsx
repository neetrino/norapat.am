import type { Metadata } from "next";
import type { ProductStatus } from "@prisma/client";
import HomeClient from "./HomeClient";
import { prisma } from "@/lib/prisma";
import { normalizeCategoryWithCount } from "@/lib/normalizeCategoryWithCount";
import type { ProductWithCategory, CategoryWithCount, Campaign } from "@/types";
import { HOME_BEST_STATUS_IN, HOME_PROMO_STATUS_IN } from "@/lib/homeShowcase";

// Revalidate home page every 60 seconds (ISR) so DB queries are cached
export const revalidate = 60;

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

/** Prisma select matching the /api/products non-paginated response */
const PRODUCT_SELECT = {
  id: true,
  name: true,
  shortDescription: true,
  description: true,
  price: true,
  originalPrice: true,
  categoryId: true,
  category: { select: { id: true, name: true, isActive: true } },
  image: true,
  images: true,
  ingredients: true,
  isAvailable: true,
  status: true,
  createdAt: true,
} as const;

async function fetchHomePageData() {
  const now = new Date();
  const bestStatusIn = HOME_BEST_STATUS_IN.split(",").filter(Boolean) as ProductStatus[];
  const promoStatusIn = HOME_PROMO_STATUS_IN.split(",").filter(Boolean) as ProductStatus[];

  const [bestProducts, promoProducts, categories, campaigns] = await Promise.all([
    prisma.product.findMany({
      where: { isAvailable: true, status: { in: bestStatusIn } },
      orderBy: { createdAt: "desc" },
      select: PRODUCT_SELECT,
    }),
    prisma.product.findMany({
      where: { isAvailable: true, status: { in: promoStatusIn } },
      orderBy: { createdAt: "desc" },
      select: PRODUCT_SELECT,
    }),
    prisma.category.findMany({
      where: { isActive: true, products: { some: { isAvailable: true } } },
      include: {
        _count: { select: { products: { where: { isAvailable: true } } } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.campaign.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return {
    bestProducts: bestProducts as unknown as ProductWithCategory[],
    promoProducts: promoProducts as unknown as ProductWithCategory[],
    categories: categories.map((category) =>
      normalizeCategoryWithCount(category as CategoryWithCount)
    ),
    campaigns: campaigns as Campaign[],
  };
}

export default async function Home() {
  // Fetch all home page data server-side — eliminates 4 client-side API waterfalls
  let initialBestProducts: ProductWithCategory[] | undefined;
  let initialPromoProducts: ProductWithCategory[] | undefined;
  let initialCategories: CategoryWithCount[] | undefined;
  let initialCampaigns: Campaign[] | undefined;

  try {
    const data = await fetchHomePageData();
    initialBestProducts = data.bestProducts;
    initialPromoProducts = data.promoProducts;
    initialCategories = data.categories;
    initialCampaigns = data.campaigns;
  } catch (e) {
    // DB unavailable — HomeClient falls back to client-side fetching
    console.error("[Home SSR] Failed to fetch initial data:", e);
  }

  return (
    <HomeClient
      initialBestProducts={initialBestProducts}
      initialPromoProducts={initialPromoProducts}
      initialCategories={initialCategories}
      initialCampaigns={initialCampaigns}
    />
  );
}
