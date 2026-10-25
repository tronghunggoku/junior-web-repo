import { beforeEach, describe, expect, it } from 'vitest';
import {
  DUPLICATE_WINDOW_MS,
  clearRequestLog,
  getRequestLogSnapshot,
  logRequest,
} from './request-log-store.js';

describe('request log', () => {
  beforeEach(() => clearRequestLog());

  it('đánh dấu trùng khi cùng URL gọi lại trong cửa sổ thời gian', () => {
    logRequest('/users', 1000);
    const second = logRequest('/users', 1000 + DUPLICATE_WINDOW_MS - 1);
    expect(second.isDuplicate).toBe(true);
  });

  it('không đánh dấu trùng khi khác URL hoặc đã quá cửa sổ (refetch hợp lệ)', () => {
    logRequest('/users', 1000);
    expect(logRequest('/quotes', 1001).isDuplicate).toBe(false);
    expect(logRequest('/users', 1000 + DUPLICATE_WINDOW_MS).isDuplicate).toBe(false);
  });

  it('mỗi lần ghi trả snapshot mới (cho useSyncExternalStore)', () => {
    const before = getRequestLogSnapshot();
    logRequest('/users');
    expect(getRequestLogSnapshot()).not.toBe(before);
    expect(getRequestLogSnapshot()).toHaveLength(1);
  });
});
