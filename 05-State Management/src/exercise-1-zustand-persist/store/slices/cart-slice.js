/**
 * Cart slice — quản lý giỏ hàng (dữ liệu sản phẩm thật lấy từ dummyjson).
 * Lưu dạng map `{ [productId]: CartItem }` để thêm/sửa/xoá là O(1)
 * và không bị trùng sản phẩm.
 *
 * Slice pattern của Zustand: mỗi slice là 1 hàm nhận (set, get) và trả về
 * phần state + action của riêng nó; store gốc sẽ gộp các slice lại.
 */
export const MAX_QUANTITY_PER_ITEM = 10;

export const createCartSlice = (set) => ({
  cartItems: {},

  addToCart: (product) =>
    set((state) => {
      const existing = state.cartItems[product.id];
      const quantity = Math.min((existing?.quantity ?? 0) + 1, MAX_QUANTITY_PER_ITEM);
      return {
        cartItems: {
          ...state.cartItems,
          // Chỉ lưu field cần thiết => dữ liệu persist gọn, không lưu cả object API
          [product.id]: {
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity,
          },
        },
      };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (!state.cartItems[productId]) return state;
      // quantity <= 0 nghĩa là xoá khỏi giỏ
      if (quantity <= 0) {
        const { [productId]: _removed, ...rest } = state.cartItems;
        return { cartItems: rest };
      }
      return {
        cartItems: {
          ...state.cartItems,
          [productId]: {
            ...state.cartItems[productId],
            quantity: Math.min(quantity, MAX_QUANTITY_PER_ITEM),
          },
        },
      };
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const { [productId]: _removed, ...rest } = state.cartItems;
      return { cartItems: rest };
    }),

  clearCart: () => set({ cartItems: {} }),
});
