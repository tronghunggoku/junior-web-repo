import { useShallow } from 'zustand/react/shallow';
import { useShopStore } from '../store/shop-store.js';
import { formatPrice, selectCartItemList, selectCartTotalUsd } from '../store/shop-selectors.js';

export function CartSummary() {
  // selectCartItemList trả mảng mới mỗi lần => bắt buộc useShallow
  const items = useShopStore(useShallow(selectCartItemList));
  const totalUsd = useShopStore(selectCartTotalUsd);
  const currency = useShopStore((state) => state.currency);
  const { updateQuantity, removeFromCart, clearCart } = useShopStore(
    useShallow((state) => ({
      updateQuantity: state.updateQuantity,
      removeFromCart: state.removeFromCart,
      clearCart: state.clearCart,
    })),
  );

  return (
    <aside className="panel cart-summary" aria-label="Giỏ hàng">
      <h2>Giỏ hàng</h2>
      {items.length === 0 ? (
        <p className="muted">Chưa có sản phẩm. Thêm vài món rồi F5 để thấy persist hoạt động.</p>
      ) : (
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.id}>
              <span className="cart-title">{item.title}</span>
              <input
                type="number"
                min="0"
                max="10"
                value={item.quantity}
                aria-label={`Số lượng ${item.title}`}
                onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
              />
              <span>{formatPrice(item.price * item.quantity, currency)}</span>
              <button type="button" className="ghost" onClick={() => removeFromCart(item.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="cart-total">
        Tổng: <strong>{formatPrice(totalUsd, currency)}</strong>
      </p>
      <button type="button" className="ghost" onClick={clearCart} disabled={items.length === 0}>
        Xoá giỏ hàng
      </button>
    </aside>
  );
}
