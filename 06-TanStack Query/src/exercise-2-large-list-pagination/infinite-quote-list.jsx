import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { quotesInfiniteQueryOptions } from './quotes-queries.js';
import { QuoteRow } from './quote-row.jsx';

/**
 * Infinite scroll với useInfiniteQuery + IntersectionObserver.
 * Chống request trùng: chỉ gọi fetchNextPage khi `hasNextPage && !isFetchingNextPage`.
 * (fetchNextPage mặc định cancelRefetch=true — gọi khi đang fetch sẽ huỷ & gọi lại => trùng.)
 */
export function InfiniteQuoteList() {
  const sentinelRef = useRef(null);
  const { data, isPending, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(quotesInfiniteQueryOptions());

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: '200px' }, // tải trước khi người dùng chạm đáy
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) return <p className="muted">Đang tải…</p>;
  if (isError) return <p className="error">Lỗi: {error.message}</p>;

  const quotes = data.pages.flatMap((page) => page.quotes);
  const total = data.pages[0]?.total ?? 0;

  return (
    <div className="panel">
      <p className="muted">
        Đã tải {quotes.length} / {total} quotes · {data.pages.length} trang trong cache
      </p>
      <ol className="quote-list">
        {quotes.map((quote) => (
          <QuoteRow key={quote.id} quote={quote} />
        ))}
      </ol>
      <div ref={sentinelRef} className="sentinel">
        {isFetchingNextPage && 'Đang tải thêm…'}
        {!hasNextPage && 'Đã hết dữ liệu 🎉'}
      </div>
    </div>
  );
}
