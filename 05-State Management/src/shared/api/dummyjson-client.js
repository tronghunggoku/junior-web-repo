// HTTP client dùng chung cho cả 2 bài tập — gọi API thật của dummyjson.com
const BASE_URL = 'https://dummyjson.com';

/**
 * Gọi GET tới dummyjson và trả JSON; ném lỗi rõ ràng nếu HTTP status không OK.
 * @param {string} path - ví dụ '/products?limit=12'
 * @param {{ signal?: AbortSignal }} [options]
 */
export async function fetchDummyJson(path, { signal } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, { signal });
  if (!response.ok) {
    throw new Error(`Request ${path} thất bại: HTTP ${response.status}`);
  }
  return response.json();
}
