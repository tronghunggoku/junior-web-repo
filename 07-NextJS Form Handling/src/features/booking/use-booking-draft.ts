import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { EMPTY_BOOKING_FORM, type BookingFormState } from './booking-form-types';

const DRAFT_KEY = 'booking-form-draft';

type BookingDraft = { step: number; values: Partial<BookingFormState> };

export function clearBookingDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // sessionStorage bị chặn (chế độ riêng tư) → bỏ qua
  }
}

/**
 * Lưu nháp form vào sessionStorage để giữ dữ liệu khi:
 * - F5 / lỡ đóng tab rồi mở lại trong cùng phiên,
 * - rời sang trang sản phẩm rồi bấm Back quay lại.
 * (Quay lại bước trước trong form thì RHF đã tự giữ vì chỉ có 1 form instance.)
 * Không lưu `agreeToTerms`: người dùng phải xác nhận lại mỗi lần.
 */
export function useBookingDraft(
  form: UseFormReturn<BookingFormState, unknown, unknown>,
  step: number,
  onRestoreStep: (step: number) => void,
  preselectedProductId: string,
) {
  // Khôi phục nháp 1 lần sau khi hydrate (sessionStorage chỉ có ở client)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as BookingDraft;
      form.reset({
        ...EMPTY_BOOKING_FORM,
        ...draft.values,
        // Link "Đặt lịch" từ trang sản phẩm được ưu tiên hơn sản phẩm trong nháp
        productId: preselectedProductId || draft.values.productId || '',
        agreeToTerms: false,
      });
      // Chỉ quay về bước 1–2: bước xác nhận luôn cần xem lại
      onRestoreStep(Math.min(Math.max(draft.step, 0), 1));
    } catch {
      clearBookingDraft(); // nháp hỏng → xoá
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ chạy lúc mount
  }, []);

  // Lưu nháp mỗi khi giá trị hoặc bước thay đổi
  useEffect(() => {
    const save = (values: Partial<BookingFormState>) => {
      try {
        const draftValues = { ...values };
        delete draftValues.agreeToTerms;
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step, values: draftValues } satisfies BookingDraft));
      } catch {
        // Hết quota / bị chặn → không lưu nháp, form vẫn chạy bình thường
      }
    };
    save(form.getValues());
    const subscription = form.watch((values) => save(values as Partial<BookingFormState>));
    return () => subscription.unsubscribe();
  }, [form, step]);
}
