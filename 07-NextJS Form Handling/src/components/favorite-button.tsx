'use client';

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'favorite-product-ids';
const CHANGE_EVENT = 'favorites-change';

function readFavoriteIds(): number[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as number[];
  } catch {
    return []; // localStorage bị chặn / dữ liệu hỏng → coi như chưa yêu thích
  }
}

/** Nghe thay đổi từ tab khác (storage) và từ các nút khác trong cùng tab (custom event). */
function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * Client Component "lá" (leaf): phần DUY NHẤT cần JS trên card sản phẩm.
 * Card / trang cha vẫn là Server Component → bundle JS gửi xuống client rất nhỏ.
 */
export function FavoriteButton({ productId }: { productId: number }) {
  const isFavorite = useSyncExternalStore(
    subscribe,
    () => readFavoriteIds().includes(productId),
    () => false, // server không có localStorage → render "chưa thích", hydrate xong mới đọc thật
  );

  const toggleFavorite = () => {
    const ids = readFavoriteIds();
    const nextIds = isFavorite ? ids.filter((id) => id !== productId) : [...ids, productId];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      // Không lưu được (chế độ riêng tư) → bỏ qua
    }
  };

  return (
    <button type="button" className="favorite-button" aria-pressed={isFavorite} onClick={toggleFavorite}>
      {isFavorite ? '♥ Đã thích' : '♡ Yêu thích'}
    </button>
  );
}
