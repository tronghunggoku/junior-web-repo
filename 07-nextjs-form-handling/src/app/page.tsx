import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { getProducts } from '@/lib/products-api';

/**
 * Chiến lược render: SSG (Static Site Generation)
 * - Nội dung giới thiệu cố định + 4 sản phẩm nổi bật → render 1 lần lúc `next build`.
 * - `revalidate = false`: không tự làm mới; deploy lại mới đổi (nội dung marketing ít thay đổi).
 */
export const revalidate = false;

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  // revalidate false cho cả fetch, nếu không trang sẽ bị kéo thành ISR theo fetch
  const featuredProducts = await getProducts(4, false);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">Trải nghiệm sản phẩm trước khi mua</h1>
        <p className="muted">
          Xem hàng trăm sản phẩm, so sánh chi tiết và đặt lịch tới showroom để dùng thử trực tiếp — chỉ 3
          bước, không cần tài khoản.
        </p>
        <div className="hero-actions">
          <Link href="/products" className="button">
            Xem sản phẩm
          </Link>
          <Link href="/booking" className="button ghost">
            Đặt lịch trải nghiệm
          </Link>
        </div>
      </section>

      <section aria-labelledby="featured-title">
        <div className="section-title">
          <h2 id="featured-title">Sản phẩm nổi bật</h2>
          <Link href="/products">Xem tất cả →</Link>
        </div>
        <ul className="product-grid">
          {featuredProducts.map((product, index) => (
            <li key={product.id}>
              <ProductCard product={product} isAboveTheFold={index < 2} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
