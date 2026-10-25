import { describe, expect, it } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { getNextQuotesSkip, getTotalPages } from './quotes-api.js';
import { quoteKeys, quotesPageQueryOptions } from './quotes-queries.js';

describe('pagination helpers', () => {
  it('tính tổng số trang', () => {
    expect(getTotalPages(1454, 20)).toBe(73);
    expect(getTotalPages(0, 20)).toBe(1);
  });

  it('getNextQuotesSkip trả undefined khi hết dữ liệu', () => {
    expect(getNextQuotesSkip({ skip: 0, limit: 20, total: 1454 })).toBe(20);
    expect(getNextQuotesSkip({ skip: 1440, limit: 20, total: 1454 })).toBeUndefined();
  });

  it('mỗi trang có query key riêng', () => {
    expect(quotesPageQueryOptions(3).queryKey).toEqual(quoteKeys.page(3));
  });
});

describe('dedupe của QueryClient (không gọi network)', () => {
  it('nhiều lần fetch cùng key đồng thời chỉ chạy queryFn 1 lần, trong staleTime dùng cache', async () => {
    const client = new QueryClient();
    let calls = 0;
    const options = {
      queryKey: ['dedupe-test'],
      queryFn: async () => {
        calls += 1;
        return 'data';
      },
      staleTime: 60_000,
    };

    await Promise.all([client.fetchQuery(options), client.fetchQuery(options), client.fetchQuery(options)]);
    await client.prefetchQuery(options); // còn fresh → bỏ qua
    expect(calls).toBe(1);
  });
});
