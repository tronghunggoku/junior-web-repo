import { getJson } from '../shared/api/http-client.js';

/** dummyjson /quotes có ~1454 bản ghi — đủ lớn để cần phân trang / infinite scroll. */
export const QUOTES_PAGE_SIZE = 20;

/** Lấy 1 trang quotes theo offset (skip/limit). Trả `{ quotes, total, skip, limit }`. */
export function fetchQuotesPage({ skip = 0, limit = QUOTES_PAGE_SIZE, signal } = {}) {
  return getJson(`/quotes?limit=${limit}&skip=${skip}`, { signal });
}

/** Tổng số trang từ response API. */
export function getTotalPages(total, pageSize = QUOTES_PAGE_SIZE) {
  return Math.max(1, Math.ceil(total / pageSize));
}

/**
 * getNextPageParam cho useInfiniteQuery: trả skip của trang tiếp theo,
 * hoặc undefined khi đã hết dữ liệu (=> hasNextPage = false, không gọi thêm).
 */
export function getNextQuotesSkip(lastPage) {
  const nextSkip = lastPage.skip + lastPage.limit;
  return nextSkip < lastPage.total ? nextSkip : undefined;
}
