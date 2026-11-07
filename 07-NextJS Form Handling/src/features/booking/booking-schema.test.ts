import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bookingDetailsSchema,
  bookingSchema,
  confirmationSchema,
  MAX_NOTE_LENGTH,
  personalInfoSchema,
} from './booking-schema';

/** Lấy thông báo lỗi đầu tiên của 1 field (giống cách RHF hiển thị inline). */
function firstError(result: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }, field: string) {
  return result.error?.issues.find((issue) => issue.path[0] === field)?.message;
}

// Cố định "bây giờ" = Thứ Bảy 07/11/2026 10:00 giờ Việt Nam (03:00 UTC)
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-07T03:00:00Z'));
});
afterEach(() => vi.useRealTimers());

const validPersonal = { fullName: 'Nguyễn Thị Ánh', email: 'anh@example.com', phone: '0912345678' };
const validDetails = { productId: '1', date: '2026-11-09', timeSlot: '10:30', guests: 2, note: '' };

describe('Edge case 1 — họ tên', () => {
  it('chỉ toàn khoảng trắng bị trim → báo thiếu ký tự', () => {
    const result = personalInfoSchema.safeParse({ ...validPersonal, fullName: '     ' });
    expect(firstError(result, 'fullName')).toBe('Họ tên phải có ít nhất 2 ký tự');
  });

  it('tiếng Việt có dấu hợp lệ, chứa số / ký tự lạ thì lỗi', () => {
    expect(personalInfoSchema.safeParse(validPersonal).success).toBe(true);
    const result = personalInfoSchema.safeParse({ ...validPersonal, fullName: 'Anh123 <b>' });
    expect(firstError(result, 'fullName')).toBe('Họ tên chỉ gồm chữ cái và khoảng trắng');
  });
});

describe('Edge case 2 — email & số điện thoại được chuẩn hoá', () => {
  it('email có khoảng trắng + chữ hoa → trim + lowercase', () => {
    const result = personalInfoSchema.parse({ ...validPersonal, email: '  Anh@Example.COM ' });
    expect(result.email).toBe('anh@example.com');
  });

  it('SĐT "+84 912.345-678" được bỏ ký tự phân cách và hợp lệ', () => {
    const result = personalInfoSchema.parse({ ...validPersonal, phone: '+84 912.345-678' });
    expect(result.phone).toBe('+84912345678');
  });

  it('đầu số không phải di động (01x) hoặc thiếu số → lỗi', () => {
    for (const phone of ['0123456789', '091234567', '+8491234567890']) {
      const result = personalInfoSchema.safeParse({ ...validPersonal, phone });
      expect(firstError(result, 'phone')).toContain('không hợp lệ');
    }
  });
});

describe('Edge case 3 — ngày hẹn', () => {
  it.each([
    ['2026-11-06', 'Ngày hẹn không được ở quá khứ'],
    ['2026-11-08', 'Showroom nghỉ Chủ nhật, vui lòng chọn ngày khác'],
    ['2027-01-07', 'Chỉ nhận đặt lịch trong vòng 60 ngày tới'],
    ['2026-02-30', 'Ngày không hợp lệ'],
    ['', 'Vui lòng chọn ngày hẹn'],
  ])('%s → "%s"', (date, message) => {
    const result = bookingDetailsSchema.safeParse({ ...validDetails, date });
    expect(firstError(result, 'date')).toBe(message);
  });
});

describe('Edge case 4 — hẹn trong ngày nhưng khung giờ đã qua (luật liên field)', () => {
  it('10:00 hiện tại, chọn 10:30 hôm nay → lỗi gắn vào timeSlot', () => {
    const result = bookingDetailsSchema.safeParse({ ...validDetails, date: '2026-11-07', timeSlot: '10:30' });
    expect(firstError(result, 'timeSlot')).toContain('ít nhất 60 phút');
  });

  it('chọn 13:30 hôm nay → hợp lệ', () => {
    expect(bookingDetailsSchema.safeParse({ ...validDetails, date: '2026-11-07', timeSlot: '13:30' }).success).toBe(true);
  });

  it('server chạy UTC lúc 23:30 UTC (= 06:30 sáng hôm sau ở VN) vẫn tính đúng "hôm nay" theo giờ VN', () => {
    vi.setSystemTime(new Date('2026-11-08T23:30:00Z')); // 09/11 06:30 VN
    const result = bookingDetailsSchema.safeParse({ ...validDetails, date: '2026-11-09', timeSlot: '09:00' });
    expect(result.success).toBe(true);
  });
});

describe('Edge case 5 — số người & ghi chú', () => {
  it.each([
    [Number.NaN, 'Vui lòng nhập số người (là số)'], // input number để trống → valueAsNumber = NaN
    [0, 'Tối thiểu 1 người'],
    [6, 'Tối đa 5 người mỗi lượt'],
    [2.5, 'Số người phải là số nguyên'],
  ])('guests = %s → "%s"', (guests, message) => {
    const result = bookingDetailsSchema.safeParse({ ...validDetails, guests });
    expect(firstError(result, 'guests')).toBe(message);
  });

  it(`ghi chú dài hơn ${MAX_NOTE_LENGTH} ký tự → lỗi; chứa HTML vẫn chỉ là text`, () => {
    const tooLong = bookingDetailsSchema.safeParse({ ...validDetails, note: 'a'.repeat(MAX_NOTE_LENGTH + 1) });
    expect(firstError(tooLong, 'note')).toBe('Ghi chú tối đa 300 ký tự');
    const html = bookingDetailsSchema.parse({ ...validDetails, note: '<script>alert(1)</script>' });
    expect(html.note).toBe('<script>alert(1)</script>'); // React escape khi render
  });
});

describe('Edge case 6 — xác nhận & validate phía server', () => {
  it('chưa tick điều khoản → lỗi tiếng Việt', () => {
    const result = confirmationSchema.safeParse({ agreeToTerms: false });
    expect(firstError(result, 'agreeToTerms')).toBe('Bạn cần đồng ý với điều khoản đặt lịch');
  });

  it('payload gửi thẳng lên server (bỏ qua client) thiếu/sai field → bị từ chối với đủ lỗi', () => {
    const result = bookingSchema.safeParse({ fullName: 'A', guests: '3', agreeToTerms: 'true' });
    expect(result.success).toBe(false);
    const fields = new Set(result.error?.issues.map((issue) => issue.path[0]));
    expect([...fields]).toEqual(expect.arrayContaining(['fullName', 'email', 'phone', 'date', 'guests', 'agreeToTerms']));
  });

  it('payload hợp lệ đầy đủ → pass', () => {
    expect(bookingSchema.safeParse({ ...validPersonal, ...validDetails, agreeToTerms: true }).success).toBe(true);
  });
});
