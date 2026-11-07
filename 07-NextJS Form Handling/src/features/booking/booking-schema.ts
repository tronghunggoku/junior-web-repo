import { z } from 'zod';
import {
  daysBetween,
  getDayOfWeek,
  getVietnamMinutesOfDay,
  getVietnamToday,
  isRealIsoDate,
  timeToMinutes,
} from './vietnam-date-utils';

/**
 * Schema Zod cho form đặt lịch 3 bước — dùng CHUNG cho client (React Hook Form)
 * và server (Server Action) để luật validate chỉ khai báo 1 nơi.
 * Mọi thông báo lỗi là tiếng Việt, hiển thị inline dưới từng field.
 */
export const TIME_SLOTS = ['09:00', '10:30', '13:30', '15:00', '16:30', '18:00'] as const;
export const MAX_GUESTS = 5;
export const MAX_NOTE_LENGTH = 300;
export const MAX_DAYS_AHEAD = 60;
/** Phải đặt trước ít nhất 60 phút nếu hẹn trong ngày */
export const MIN_LEAD_MINUTES = 60;

// Chữ cái mọi ngôn ngữ (có dấu tiếng Việt), khoảng trắng, dấu nháy, gạch nối
const PERSON_NAME_PATTERN = /^[\p{L}\s'.-]+$/u;
// Đầu số di động VN: 03, 05, 07, 08, 09 — chấp nhận tiền tố +84 hoặc 0
const VN_MOBILE_PATTERN = /^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/;

// ---------------- Bước 1: thông tin cá nhân ----------------
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(60, 'Họ tên tối đa 60 ký tự')
    .regex(PERSON_NAME_PATTERN, 'Họ tên chỉ gồm chữ cái và khoảng trắng'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Vui lòng nhập email')
    .pipe(z.email('Email không đúng định dạng (vd: ten@gmail.com)')),
  phone: z
    .string()
    // Người dùng hay gõ "0912 345 678" hoặc "0912.345.678" → bỏ khoảng trắng / dấu chấm / gạch
    .overwrite((value) => value.replace(/[\s.-]/g, ''))
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(VN_MOBILE_PATTERN, 'Số điện thoại di động Việt Nam không hợp lệ (vd: 0912345678)'),
});

// ---------------- Bước 2: chi tiết lịch hẹn ----------------
export const bookingDetailsSchema = z
  .object({
    productId: z.string().min(1, 'Vui lòng chọn sản phẩm muốn trải nghiệm'),
    date: z
      .string()
      .min(1, 'Vui lòng chọn ngày hẹn')
      .refine(isRealIsoDate, 'Ngày không hợp lệ')
      .refine((date) => date >= getVietnamToday(), 'Ngày hẹn không được ở quá khứ')
      .refine(
        (date) => daysBetween(getVietnamToday(), date) <= MAX_DAYS_AHEAD,
        `Chỉ nhận đặt lịch trong vòng ${MAX_DAYS_AHEAD} ngày tới`,
      )
      .refine((date) => getDayOfWeek(date) !== 0, 'Showroom nghỉ Chủ nhật, vui lòng chọn ngày khác'),
    timeSlot: z.enum(TIME_SLOTS, { error: 'Vui lòng chọn khung giờ' }),
    guests: z
      .number({ error: 'Vui lòng nhập số người (là số)' })
      .int('Số người phải là số nguyên')
      .min(1, 'Tối thiểu 1 người')
      .max(MAX_GUESTS, `Tối đa ${MAX_GUESTS} người mỗi lượt`),
    note: z.string().trim().max(MAX_NOTE_LENGTH, `Ghi chú tối đa ${MAX_NOTE_LENGTH} ký tự`),
  })
  // Luật liên field: hẹn trong ngày thì giờ hẹn phải cách hiện tại ≥ 60 phút
  .refine(
    ({ date, timeSlot }) =>
      date !== getVietnamToday() ||
      timeToMinutes(timeSlot) - getVietnamMinutesOfDay() >= MIN_LEAD_MINUTES,
    {
      message: `Khung giờ này đã qua hoặc quá sát giờ, hãy chọn giờ cách hiện tại ít nhất ${MIN_LEAD_MINUTES} phút`,
      path: ['timeSlot'],
    },
  );

// ---------------- Bước 3: xác nhận ----------------
export const confirmationSchema = z.object({
  agreeToTerms: z.literal(true, { error: 'Bạn cần đồng ý với điều khoản đặt lịch' }),
});

/**
 * Schema đầy đủ = giao của 3 bước. Dùng intersection (không phải .extend) để
 * refine liên field của bước 2 vẫn chạy độc lập dù bước khác còn lỗi.
 */
export const bookingSchema = personalInfoSchema.and(bookingDetailsSchema).and(confirmationSchema);

export type BookingFormInput = z.input<typeof bookingSchema>;
export type BookingFormValues = z.output<typeof bookingSchema>;

/** Field thuộc từng bước — dùng cho trigger() khi bấm "Tiếp tục" và để nhảy về bước có lỗi. */
export const BOOKING_STEP_FIELDS = [
  ['fullName', 'email', 'phone'],
  ['productId', 'date', 'timeSlot', 'guests', 'note'],
  ['agreeToTerms'],
] as const satisfies ReadonlyArray<ReadonlyArray<keyof BookingFormInput>>;

export function findStepOfField(field: string): number {
  const index = BOOKING_STEP_FIELDS.findIndex((fields) => (fields as readonly string[]).includes(field));
  return index === -1 ? 0 : index;
}
