import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Корень проекта для трассировки файлов (избегаем конфликта с lockfile в родительской папке)
  outputFileTracingRoot: path.join(__dirname),
  eslint: {
    // Отключаем ESLint во время сборки для продакшена
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Отключаем проверку типов во время сборки
    ignoreBuildErrors: true,
  },
  // Оптимизация изображений
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 год
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    qualities: [75, 85, 100],
    remotePatterns:
      process.env.R2_PUBLIC_URL && process.env.R2_PUBLIC_URL.startsWith('https')
        ? [
            {
              protocol: 'https',
              hostname: new URL(process.env.R2_PUBLIC_URL).hostname,
              pathname: '/**',
            },
          ]
        : [],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // Cache RSC payloads in the client-side router:
    //   dynamic: 30s — avoids redundant server round-trips on back/forward
    //   static:  300s — keep fully-static segments in client cache for 5 min
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },
  // turbopack SVG rule removed: @svgr/webpack was not installed
  // Gzip/Brotli compression
  compress: true,
  // HTTP caching headers
  async headers() {
    return [
      // API — products list: 1 h CDN cache, 2 h stale-while-revalidate
      {
        source: '/api/products/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=7200',
          },
        ],
      },
      // API — categories: 5 min CDN cache (rarely change)
      {
        source: '/api/categories',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
      // API — campaigns: 5 min CDN cache
      {
        source: '/api/campaigns',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
      // Static images in /public: immutable 1-year cache
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/categories/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Public PNG/WebP assets (logos, hero slides, illustrations)
      {
        source: '/:file(.*\\.(?:png|webp|jpg|jpeg|avif|gif|svg|ico))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      // Fonts from /_next/static — already hashed, immutable
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;