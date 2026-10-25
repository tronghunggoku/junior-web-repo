import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { quotesPageQueryOptions } from './quotes-queries.js';
import { getTotalPages } from './quotes-api.js';
import { QuoteRow } from './quote-row.jsx';

/**
 * Phân trang với useQuery:
 * - placeholderData: keepPreviousData → chuyển trang giữ nguyên data cũ, không nháy loading.
 * - prefetch trang kế tiếp → bấm "Sau" hiện ngay, request đã được gọi trước đúng 1 lần.
 * - Quay lại trang đã xem → lấy cache (còn trong staleTime) → 0 request.
 */
export function PaginatedQuoteList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error, isPlaceholderData, isFetching } = useQuery(
    quotesPageQueryOptions(page),
  );

  const totalPages = data ? getTotalPages(data.total) : 1;
  const hasNextPage = page < totalPages;

  useEffect(() => {
    // Chỉ prefetch khi đã có data thật của trang hiện tại; prefetchQuery tự bỏ qua nếu cache còn fresh
    if (!isPlaceholderData && hasNextPage) {
      queryClient.prefetchQuery(quotesPageQueryOptions(page + 1));
    }
  }, [page, hasNextPage, isPlaceholderData, queryClient]);

  if (isPending) return <p className="muted">Đang tải trang đầu…</p>;
  if (isError) return <p className="error">Lỗi: {error.message}</p>;

  return (
    <div className="panel">
      <nav className="pagination" aria-label="Phân trang">
        <button type="button" onClick={() => setPage(1)} disabled={page === 1}>
          « Đầu
        </button>
        <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          ‹ Trước
        </button>
        <span>
          Trang <strong>{page}</strong> / {totalPages} · {data.total} quotes
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          // Chặn bấm tiếp khi đang hiện data placeholder (trang mới chưa về)
          disabled={!hasNextPage || isPlaceholderData}
        >
          Sau ›
        </button>
        <button
          type="button"
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages || isPlaceholderData}
        >
          Cuối »
        </button>
        {isFetching && <span className="muted">đang tải…</span>}
      </nav>
      <ol className={isPlaceholderData ? 'quote-list is-stale' : 'quote-list'}>
        {data.quotes.map((quote) => (
          <QuoteRow key={quote.id} quote={quote} />
        ))}
      </ol>
    </div>
  );
}
