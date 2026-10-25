import { useState } from 'react';
import { ManualFetchUserList } from './before-manual-fetch/manual-fetch-user-list.jsx';
import { QueryUserList } from './after-use-query/query-user-list.jsx';
import { clearRequestLog } from '../shared/api/request-log-store.js';

const MODES = {
  before: { label: '❌ Before: useEffect fetch', List: ManualFetchUserList },
  after: { label: '✅ After: useQuery', List: QueryUserList },
};

/**
 * Render CÙNG 1 danh sách ở 2 chỗ (sidebar + bảng chính) như app thật.
 * Nút "Unmount / Mount lại" mô phỏng đổi trang để thấy cache của useQuery.
 */
export function UseQueryMigrationDemo() {
  const [mode, setMode] = useState('before');
  const [isMounted, setIsMounted] = useState(true);
  const { List } = MODES[mode];

  const switchMode = (nextMode) => {
    clearRequestLog();
    setMode(nextMode);
  };

  return (
    <section aria-labelledby="migration-title">
      <header className="section-header">
        <h2 id="migration-title">Bài 1 — Fetch thủ công → useQuery</h2>
        <div className="toolbar">
          {Object.entries(MODES).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              className={key === mode ? '' : 'ghost'}
              onClick={() => switchMode(key)}
            >
              {label}
            </button>
          ))}
          <button type="button" className="ghost" onClick={() => setIsMounted((value) => !value)}>
            {isMounted ? 'Unmount' : 'Mount lại'}
          </button>
        </div>
      </header>
      {isMounted && (
        <div className="two-columns" key={mode}>
          <List title="Sidebar: thành viên" />
          <List title="Bảng chính: thành viên" />
        </div>
      )}
    </section>
  );
}
