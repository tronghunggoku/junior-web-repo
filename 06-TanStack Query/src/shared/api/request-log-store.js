/**
 * Request log — ghi lại MỌI request đi qua http-client để kiểm tra trùng lặp
 * ngay trên UI (song song với tab Network của DevTools).
 *
 * "Request trùng" = cùng URL được gọi lại trong DUPLICATE_WINDOW_MS
 * (tức là gọi đồng thời / ngay sau nhau — dấu hiệu fetch thừa, không phải refetch hợp lệ).
 */
export const DUPLICATE_WINDOW_MS = 2000;

let entries = [];
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Thêm 1 entry; trả entry vừa thêm (có cờ isDuplicate). */
export function logRequest(url, now = Date.now()) {
  const isDuplicate = entries.some(
    (entry) => entry.url === url && now - entry.at < DUPLICATE_WINDOW_MS,
  );
  const entry = { id: entries.length + 1, url, at: now, isDuplicate };
  // Tạo mảng mới để useSyncExternalStore nhận ra snapshot thay đổi
  entries = [...entries, entry];
  emit();
  return entry;
}

export function clearRequestLog() {
  entries = [];
  emit();
}

export function subscribeRequestLog(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getRequestLogSnapshot() {
  return entries;
}
