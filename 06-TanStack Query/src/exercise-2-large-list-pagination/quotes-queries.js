import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';
import { QUOTES_PAGE_SIZE, fetchQuotesPage, getNextQuotesSkip } from './quotes-api.js';

// Quotes là dữ liệu tĩnh → để fresh 10 phút: quay lại trang cũ không gọi API nữa
const QUOTES_STALE_TIME = 10 * 60 * 1000;

export const quoteKeys = {
  all: ['quotes'],
  page: (page) => [...quoteKeys.all, 'page', page],
  infinite: () => [...quoteKeys.all, 'infinite'],
};

/** Phân trang: mỗi trang 1 cache entry riêng theo key ['quotes','page',n]. */
export const quotesPageQueryOptions = (page) =>
  queryOptions({
    queryKey: quoteKeys.page(page),
    // Không dùng `signal`: bấm chuyển trang nhanh thì request trang cũ vẫn chạy xong và vào
    // cache (thay vì bị huỷ rồi phải gọi lại khi quay về) — xem users-queries.js
    queryFn: () =>
      fetchQuotesPage({ skip: (page - 1) * QUOTES_PAGE_SIZE, limit: QUOTES_PAGE_SIZE }),
    staleTime: QUOTES_STALE_TIME,
    // Giữ data trang cũ trong lúc tải trang mới → không nháy "Loading", không giật layout
    placeholderData: keepPreviousData,
  });

/** Infinite: 1 cache entry chứa mảng `pages`, mỗi lần fetchNextPage nối thêm 1 trang. */
export const quotesInfiniteQueryOptions = () =>
  infiniteQueryOptions({
    queryKey: quoteKeys.infinite(),
    queryFn: ({ pageParam }) => fetchQuotesPage({ skip: pageParam, limit: QUOTES_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: getNextQuotesSkip,
    staleTime: QUOTES_STALE_TIME,
  });
