import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  async headers() {
    return [{ source: '/family/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }, { key: 'Cache-Control', value: 'private, no-store' }] }];
  }
};
export default nextConfig;
