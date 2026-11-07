import type { BookingFormInput } from './booking-schema';

/**
 * Giá trị form khi người dùng ĐANG nhập — lỏng hơn kiểu sau validate:
 * timeSlot cho phép '' (chưa chọn), agreeToTerms là boolean (chưa tick = false).
 */
export type BookingFormState = Omit<BookingFormInput, 'timeSlot' | 'agreeToTerms'> & {
  timeSlot: BookingFormInput['timeSlot'] | '';
  agreeToTerms: boolean;
};

export type ProductOption = { id: string; title: string };

export const EMPTY_BOOKING_FORM: BookingFormState = {
  fullName: '',
  email: '',
  phone: '',
  productId: '',
  date: '',
  timeSlot: '',
  guests: 1,
  note: '',
  agreeToTerms: false,
};

export const BOOKING_STEP_TITLES = ['Thông tin liên hệ', 'Chi tiết lịch hẹn', 'Xác nhận'] as const;
