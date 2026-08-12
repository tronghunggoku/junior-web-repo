import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Hàm helper cn() kết hợp clsx và tailwind-merge
 * Giúp ghép class động và xử lý đè class Tailwind CSS chuẩn xác.
 * @param  {...any} inputs Các class string, object, array điều kiện
 * @returns {string} Chuỗi class Tailwind hoàn chỉnh
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
