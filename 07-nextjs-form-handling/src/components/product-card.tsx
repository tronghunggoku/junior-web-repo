import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/products-api';
import { formatPrice } from '@/lib/format-price';
import { FavoriteButton } from './favorite-button';

type ProductCardProps = {
  product: Product;
  /** Ảnh nằm trong màn hình đầu (LCP) thì preload, còn lại lazy-load */
  isAboveTheFold?: boolean;
  /** Cấp heading theo ngữ cảnh để không nhảy cấp (h1 → h3) — tốt cho a11y & SEO */
  headingLevel?: 'h2' | 'h3';
};

/** Server Component — chỉ <FavoriteButton> bên trong là client. */
export function ProductCard({ product, isAboveTheFold = false, headingLevel: Heading = 'h3' }: ProductCardProps) {
  return (
    <article className="product-card">
      <Image
        src={product.thumbnail}
        alt={product.title}
        width={300}
        height={300}
        sizes="(max-width: 760px) 50vw, 260px"
        preload={isAboveTheFold}
        loading={isAboveTheFold ? 'eager' : 'lazy'}
      />
      <p className="muted">{product.category}</p>
      <Heading className="product-card-title">
        <Link href={`/products/${product.id}`}>{product.title}</Link>
      </Heading>
      <p className="price">{formatPrice(product.price)}</p>
      <FavoriteButton productId={product.id} />
    </article>
  );
}
