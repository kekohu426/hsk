import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // 图片优化配置
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://chinesemaster.com',
  },

  // 输出配置（用于SSG）
  output: 'standalone',

  // 启用压缩
  compress: true,

  // 启用 SWC minification
  swcMinify: true,

  // 生产环境优化
  productionBrowserSourceMaps: false,

  // 启用 experimental features for better SEO
  experimental: {
    optimizeCss: true,
  },

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },

  // Redirects - 重定向旧的词汇详情页到统一页面
  async redirects() {
    return [
      {
        source: '/dashboard/hsk-library/word/:slug',
        destination: '/word/:slug',
        permanent: true, // 301永久重定向
      },
    ];
  },
};

export default nextConfig;
