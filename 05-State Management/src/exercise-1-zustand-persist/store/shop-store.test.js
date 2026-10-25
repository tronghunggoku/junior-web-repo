import { beforeEach, describe, expect, it } from 'vitest';
import { createStore } from 'zustand/vanilla';
import { createShopState, migrateShopState } from './shop-store.js';
import { MAX_QUANTITY_PER_ITEM } from './slices/cart-slice.js';
import { formatPrice, selectCartCount, selectCartTotalUsd } from './shop-selectors.js';

const phone = { id: 1, title: 'Phone', price: 100, thumbnail: 'p.png', category: 'x', stock: 5 };
const laptop = { id: 2, title: 'Laptop', price: 500, thumbnail: 'l.png' };

// Store thật dùng chung state creator với app, chỉ bỏ persist (node không có localStorage)
let store;
beforeEach(() => {
  store = createStore(createShopState);
});

describe('cart slice', () => {
  it('thêm sản phẩm, cộng dồn số lượng và chỉ lưu field cần thiết', () => {
    store.getState().addToCart(phone);
    store.getState().addToCart(phone);
    store.getState().addToCart(laptop);

    const { cartItems } = store.getState();
    expect(cartItems[1]).toEqual({ id: 1, title: 'Phone', price: 100, thumbnail: 'p.png', quantity: 2 });
    expect(selectCartCount(store.getState())).toBe(3);
    expect(selectCartTotalUsd(store.getState())).toBe(700);
  });

  it('giới hạn số lượng tối đa mỗi sản phẩm', () => {
    for (let i = 0; i < MAX_QUANTITY_PER_ITEM + 3; i += 1) store.getState().addToCart(phone);
    expect(store.getState().cartItems[1].quantity).toBe(MAX_QUANTITY_PER_ITEM);
  });

  it('updateQuantity về 0 sẽ xoá sản phẩm; id không tồn tại thì bỏ qua', () => {
    store.getState().addToCart(phone);
    store.getState().updateQuantity(999, 3);
    store.getState().updateQuantity(1, 0);
    expect(store.getState().cartItems).toEqual({});
  });

  it('clearCart không ảnh hưởng preferences slice', () => {
    store.getState().setCurrency('VND');
    store.getState().addToCart(phone);
    store.getState().clearCart();
    expect(store.getState().cartItems).toEqual({});
    expect(store.getState().currency).toBe('VND');
  });
});

describe('preferences slice', () => {
  it('bỏ qua tiền tệ không hỗ trợ và toggle theme', () => {
    store.getState().setCurrency('EUR');
    expect(store.getState().currency).toBe('USD');
    store.getState().toggleTheme();
    expect(store.getState().theme).toBe('dark');
  });
});

describe('persist migrate + format', () => {
  it('migrate v1 (cart mảng) sang v2 (cartItems map)', () => {
    const v1 = { cart: [{ ...phone, quantity: 2 }], currency: 'VND' };
    const migrated = migrateShopState(v1, 1);
    expect(migrated).toEqual({ currency: 'VND', cartItems: { 1: { ...phone, quantity: 2 } } });
  });

  it('format giá theo USD / VND', () => {
    expect(formatPrice(10, 'USD')).toBe('$10.00');
    expect(formatPrice(10, 'VND')).toContain('250.000');
  });
});
