import { useShopStore } from '../store/shop-store.js';
import { formatPrice, selectQuantityOf } from '../store/shop-selectors.js';
import { useProductCatalog } from '../hooks/use-product-catalog.js';

function ProductCard({ product }) {
  // Mỗi card chỉ subscribe đúng số lượng của sản phẩm mình => card khác không re-render
  const quantity = useShopStore(selectQuantityOf(product.id));
  const currency = useShopStore((state) => state.currency);
  const addToCart = useShopStore((state) => state.addToCart);

  return (
    <article className="product-card">
      <img src={product.thumbnail} alt={product.title} loading="lazy" width="120" height="120" />
      <h3>{product.title}</h3>
      <p className="muted">{product.category}</p>
      <p className="price">{formatPrice(product.price, currency)}</p>
      <button type="button" onClick={() => addToCart(product)}>
        Thêm vào giỏ {quantity > 0 && <span className="badge">{quantity}</span>}
      </button>
    </article>
  );
}

export function ProductCatalog() {
  const { products, status, error } = useProductCatalog();

  if (status === 'loading') return <p className="muted">Đang tải sản phẩm…</p>;
  if (status === 'error') return <p className="error">Lỗi: {error}</p>;

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
