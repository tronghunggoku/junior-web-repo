import type { Metadata } from 'next';
import { ProductCard } from '@/components/product-card';
import { getProducts } from '@/lib/products-api';

/**
 * Chiến lược render: ISR (Incremental Static Regeneration)
 * - Trang build tĩnh sẵn (nhanh như SSG, cache ở CDN).
 * - Sau 1 giờ (3600s), request kế tiếp nhận bản cũ ngay và kích hoạt render lại ở nền
 *   → giá/tồn kho được cập nhật mà không cần deploy lại.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Sản phẩm',
  description: 'Danh sách sản phẩm công nghệ, làm đẹp và nội thất đang trưng bày tại TechNest Showroom.',
  alternates: { canonical: '/products' },
  openGraph: { title: 'Sản phẩm | TechNest Showroom', url: '/products' },
};

export default async function ProductsPage() {
  const products = await getProducts(24);

  return (
    <section aria-labelledby="products-title">
      <h1 id="products-title">Sản phẩm</h1>
      <p className="muted">{products.length} sản phẩm · dữ liệu làm mới mỗi giờ (ISR)</p>
      <ul className="product-grid">
        {products.map((product, index) => (
          <li key={product.id}>
            <ProductCard product={product} isAboveTheFold={index < 4} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </section>
  );
}
