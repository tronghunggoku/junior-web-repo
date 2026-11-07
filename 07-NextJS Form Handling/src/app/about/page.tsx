import type { Metadata } from 'next';

/**
 * Chiến lược render: SSG thuần
 * - Không fetch dữ liệu, không đọc cookies/searchParams → Next.js tự prerender lúc build.
 * - `dynamic = 'force-static'` khẳng định rõ ý định: nếu ai đó lỡ dùng API động, build sẽ báo lỗi.
 */
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description: 'Về TechNest Showroom và cách dự án chọn chiến lược render SSG / ISR / SSR cho từng trang.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'Giới thiệu | TechNest Showroom', url: '/about' },
};

const RENDER_STRATEGIES = [
  { route: '/', strategy: 'SSG', reason: 'Nội dung marketing + sản phẩm nổi bật, đổi khi deploy' },
  { route: '/products', strategy: 'ISR (1 giờ)', reason: 'Giá/tồn kho đổi định kỳ, cần nhanh + SEO' },
  { route: '/products/[id]', strategy: 'ISR + generateStaticParams', reason: 'Build sẵn 12 sản phẩm hot, phần còn lại render khi có người xem' },
  { route: '/booking', strategy: 'SSR (dynamic)', reason: 'Đọc ?product= theo từng request để điền sẵn form' },
  { route: '/about', strategy: 'SSG (force-static)', reason: 'Nội dung tĩnh hoàn toàn' },
];

export default function AboutPage() {
  return (
    <article className="prose">
      <h1>Giới thiệu</h1>
      <p>
        TechNest Showroom là dự án mẫu cho bài tập Next.js App Router: 4 trang nội dung + 1 form đặt lịch
        nhiều bước. Mỗi trang chọn chiến lược render theo mức độ thay đổi của dữ liệu.
      </p>
      <h2>Chiến lược render từng trang</h2>
      <table className="strategy-table">
        <thead>
          <tr>
            <th scope="col">Route</th>
            <th scope="col">Chiến lược</th>
            <th scope="col">Lý do</th>
          </tr>
        </thead>
        <tbody>
          {RENDER_STRATEGIES.map((row) => (
            <tr key={row.route}>
              <td>
                <code>{row.route}</code>
              </td>
              <td>{row.strategy}</td>
              <td>{row.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Công nghệ</h2>
      <p>
        Next.js App Router, Server Components, <code>next/image</code>, <code>next/font</code>, React Hook
        Form + Zod cho form đặt lịch, Server Action để validate lại dữ liệu phía server.
      </p>
    </article>
  );
}
