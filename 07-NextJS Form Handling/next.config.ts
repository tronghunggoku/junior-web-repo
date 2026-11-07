import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Cho phép next/image tối ưu ảnh sản phẩm từ CDN của dummyjson
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.dummyjson.com', pathname: '/product-images/**' }],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
