'use server';

import { randomUUID } from 'node:crypto';
import { getProduct } from '@/lib/products-api';
import { bookingSchema } from './booking-schema';

export type BookingFieldErrors = Partial<Record<string, string>>;

export type SubmitBookingResult =
  | { ok: true; bookingCode: string; productTitle: string }
  | { ok: false; fieldErrors: BookingFieldErrors; formError?: string };

/**
 * Server Action nhận dữ liệu form. KHÔNG tin client: validate lại bằng đúng schema Zod
 * dùng ở client (ai đó có thể gọi action trực tiếp với payload tuỳ ý).
 */
export async function submitBookingAction(input: unknown): Promise<SubmitBookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: BookingFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? 'form');
      fieldErrors[field] ??= issue.message; // giữ lỗi đầu tiên của mỗi field
    }
    return { ok: false, fieldErrors, formError: 'Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại.' };
  }

  try {
    // Sản phẩm có thể đã bị gỡ giữa lúc mở form và lúc gửi
    const product = await getProduct(parsed.data.productId);
    if (!product) {
      return { ok: false, fieldErrors: { productId: 'Sản phẩm này không còn tồn tại, vui lòng chọn sản phẩm khác' } };
    }
    if (product.stock === 0) {
      return { ok: false, fieldErrors: { productId: 'Sản phẩm đã hết hàng trưng bày, vui lòng chọn sản phẩm khác' } };
    }

    // Bài tập không có DB: sinh mã đặt lịch để hiển thị xác nhận
    const bookingCode = `BK-${randomUUID().slice(0, 8).toUpperCase()}`;
    return { ok: true, bookingCode, productTitle: product.title };
  } catch {
    return { ok: false, fieldErrors: {}, formError: 'Máy chủ đang bận, vui lòng thử lại sau ít phút.' };
  }
}
