import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FavoriteButton } from '@/components/favorite-button';
import { formatPrice } from '@/lib/format-price';
import { getProduct, getProducts } from '@/lib/products-api';

/**
 * Chiến lược render: ISR + generateStaticParams
 * - 12 sản phẩm phổ biến được build sẵn lúc `next build` (SSG).
 * - Sản phẩm khác (dynamicParams = true) render lần đầu khi có người truy cập, sau đó cache lại.
 * - Làm mới mỗi giờ như trang danh sách. id không tồn tại → notFound() (404).
 */
export const revalidate = 3600;
export const dynamicParams = true;

type ProductPageProps = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const products = await getProducts(12);
  return products.map((product) => ({ id: String(product.id) }));
}

/** Metadata SEO riêng cho từng sản phẩm: title, description, ảnh OpenGraph. */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id); // fetch được Next.js dedupe với lần gọi trong page
  if (!product) return { title: 'Không tìm thấy sản phẩm' };

  const description = product.description.slice(0, 155);
  return {
    title: product.title,
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      type: 'website',
      title: product.title,
      description,
      url: `/products/${product.id}`,
      images: [{ url: product.thumbnail, alt: product.title }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <article>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/products">Sản phẩm</Link> / <span>{product.title}</span>
      </nav>
      <div className="product-detail">
        <div className="product-detail-image">
          <Image
            src={product.images[0] ?? product.thumbnail}
            alt={product.title}
            width={600}
            height={600}
            sizes="(max-width: 760px) 100vw, 540px"
            preload
          />
        </div>
        <div>
          <h1>{product.title}</h1>
          <ul className="product-meta">
            <li className="tag">{product.category}</li>
            {product.brand && <li className="tag">{product.brand}</li>}
            <li className="tag">★ {product.rating.toFixed(1)}</li>
            <li className="tag">{product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}</li>
          </ul>
          <p>{product.description}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatPrice(product.price)}</p>
          <div className="detail-actions">
            <Link href={`/booking?product=${product.id}`} className="button">
              Đặt lịch trải nghiệm
            </Link>
            <FavoriteButton productId={product.id} />
          </div>
        </div>
      </div>
    </article>
  );
}
