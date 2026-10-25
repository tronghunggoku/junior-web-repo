/**
 * Selector cho shop store. Selector trả về giá trị nguyên thuỷ (number/string)
 * để component chỉ re-render khi đúng giá trị đó đổi.
 * Selector trả mảng/object mới (như selectCartItemList) PHẢI đi kèm `useShallow`
 * — nếu không Zustand v5 sẽ re-render vô hạn.
 */
const VND_PER_USD = 25_000;

export const selectCartItemList = (state) => Object.values(state.cartItems);

export const selectCartCount = (state) =>
  Object.values(state.cartItems).reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotalUsd = (state) =>
  Object.values(state.cartItems).reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectQuantityOf = (productId) => (state) => state.cartItems[productId]?.quantity ?? 0;

/** Format giá USD theo tiền tệ người dùng chọn. */
export function formatPrice(amountUsd, currency) {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
      Math.round(amountUsd * VND_PER_USD),
    );
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amountUsd);
}
