import { useSyncExternalStore } from 'react';
import {
  clearRequestLog,
  getRequestLogSnapshot,
  subscribeRequestLog,
} from '../api/request-log-store.js';

/** Panel hiển thị số request đã gọi và đánh dấu request trùng. */
export function RequestLogPanel() {
  const entries = useSyncExternalStore(subscribeRequestLog, getRequestLogSnapshot);
  const duplicateCount = entries.filter((entry) => entry.isDuplicate).length;

  return (
    <aside className="panel request-log" aria-label="Request log">
      <header className="request-log-header">
        <strong>Network log</strong>
        <span className="badge">{entries.length} request</span>
        <span className={duplicateCount > 0 ? 'badge badge-danger' : 'badge badge-ok'}>
          {duplicateCount} trùng
        </span>
        <button type="button" className="ghost" onClick={clearRequestLog}>
          Xoá log
        </button>
      </header>
      <ol className="request-log-list">
        {entries
          .slice(-12)
          .reverse()
          .map((entry) => (
            <li key={entry.id} className={entry.isDuplicate ? 'duplicate' : ''}>
              <code>#{entry.id} GET {entry.url}</code>
              {entry.isDuplicate && <span className="badge badge-danger">TRÙNG</span>}
            </li>
          ))}
      </ol>
    </aside>
  );
}
