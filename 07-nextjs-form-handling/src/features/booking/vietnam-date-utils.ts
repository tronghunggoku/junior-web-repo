/**
 * Tiện ích ngày giờ theo múi giờ Việt Nam.
 * Server (Vercel) chạy UTC còn người dùng ở UTC+7 → nếu dùng `new Date()` trần,
 * "hôm nay" ở server và client có thể lệch nhau 1 ngày. Mọi so sánh đều quy về Asia/Ho_Chi_Minh.
 */
const VIETNAM_TIME_ZONE = 'Asia/Ho_Chi_Minh';
const DAY_MS = 24 * 60 * 60 * 1000;

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: VIETNAM_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const hourMinuteFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: VIETNAM_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** 'YYYY-MM-DD' của ngày hiện tại ở Việt Nam. */
export function getVietnamToday(now = new Date()): string {
  return dateFormatter.format(now);
}

/** Số phút từ 00:00 tới thời điểm hiện tại ở Việt Nam. */
export function getVietnamMinutesOfDay(now = new Date()): number {
  const [hours, minutes] = hourMinuteFormatter.format(now).split(':').map(Number);
  return hours * 60 + minutes;
}

/** Kiểm tra chuỗi 'YYYY-MM-DD' là ngày có thật (loại 2026-02-30). */
export function isRealIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/** Số ngày từ `fromIso` tới `toIso` (cả hai dạng 'YYYY-MM-DD'). */
export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / DAY_MS);
}

/** 0 = Chủ nhật … 6 = Thứ bảy. */
export function getDayOfWeek(isoDate: string): number {
  return new Date(`${isoDate}T00:00:00Z`).getUTCDay();
}

/** 'HH:mm' → số phút trong ngày. */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
