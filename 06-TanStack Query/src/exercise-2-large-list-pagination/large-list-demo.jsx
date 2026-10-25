import { useState } from 'react';
import { PaginatedQuoteList } from './paginated-quote-list.jsx';
import { InfiniteQuoteList } from './infinite-quote-list.jsx';

const VIEWS = {
  pagination: { label: 'Phân trang', View: PaginatedQuoteList },
  infinite: { label: 'Infinite scroll', View: InfiniteQuoteList },
};

/** Bài 2: danh sách lớn (~1454 quotes) — chuyển giữa phân trang và infinite, cache giữ nguyên. */
export function LargeListDemo() {
  const [view, setView] = useState('pagination');
  const { View } = VIEWS[view];

  return (
    <section aria-labelledby="large-list-title">
      <header className="section-header">
        <h2 id="large-list-title">Bài 2 — Danh sách lớn: phân trang / infinite</h2>
        <div className="toolbar">
          {Object.entries(VIEWS).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              className={key === view ? '' : 'ghost'}
              onClick={() => setView(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      <View />
    </section>
  );
}
