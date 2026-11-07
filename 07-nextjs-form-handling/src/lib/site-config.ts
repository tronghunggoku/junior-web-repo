/** Thông tin site dùng cho metadata SEO / OpenGraph. */
export const siteConfig = {
  name: 'TechNest Showroom',
  description:
    'Showroom trải nghiệm sản phẩm công nghệ và làm đẹp — xem sản phẩm, đọc thông tin chi tiết và đặt lịch trải nghiệm trực tiếp.',
  // Vercel tự cấp VERCEL_PROJECT_PRODUCTION_URL khi deploy; local dùng localhost
  url: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000',
  locale: 'vi_VN',
};

export const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/products', label: 'Sản phẩm' },
  { href: '/booking', label: 'Đặt lịch' },
  { href: '/about', label: 'Giới thiệu' },
] as const;
