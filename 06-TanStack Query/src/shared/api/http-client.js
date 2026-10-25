import { logRequest } from './request-log-store.js';

const BASE_URL = 'https://dummyjson.com';

/**
 * GET JSON từ dummyjson. Mọi request đều được ghi vào request log
 * để đếm số lần gọi thật sự ra network.
 * @param {string} path - ví dụ '/users?limit=5'
 * @param {{ signal?: AbortSignal }} [options] - tuỳ chọn, để huỷ request khi cần
 */
export async function getJson(path, { signal } = {}) {
  const url = `${BASE_URL}${path}`;
  logRequest(path);

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`GET ${path} thất bại: HTTP ${response.status}`);
  }
  return response.json();
}
