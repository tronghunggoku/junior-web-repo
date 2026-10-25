import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createCartSlice } from './slices/cart-slice.js';
import { createPreferencesSlice } from './slices/preferences-slice.js';

export const SHOP_STORAGE_KEY = 'shop-store';
export const SHOP_STORE_VERSION = 2;

/** Gộp tất cả slice thành 1 state creator — dùng lại được cho test (không persist). */
export const createShopState = (...args) => ({
  ...createCartSlice(...args),
  ...createPreferencesSlice(...args),
});

/**
 * Migrate dữ liệu cũ trong localStorage khi đổi cấu trúc state.
 * v1 lưu cart dạng mảng `cart: CartItem[]` → v2 đổi sang map `cartItems`.
 */
export function migrateShopState(persistedState, version) {
  if (version < 2 && Array.isArray(persistedState?.cart)) {
    const cartItems = Object.fromEntries(persistedState.cart.map((item) => [item.id, item]));
    const { cart: _legacyCart, ...rest } = persistedState;
    return { ...rest, cartItems };
  }
  return persistedState;
}

export const useShopStore = create(
  persist(createShopState, {
    name: SHOP_STORAGE_KEY,
    version: SHOP_STORE_VERSION,
    storage: createJSONStorage(() => localStorage),
    // Chỉ persist DATA, không persist function/action hay state tạm thời
    partialize: (state) => ({
      cartItems: state.cartItems,
      currency: state.currency,
      theme: state.theme,
    }),
    migrate: migrateShopState,
  }),
);
