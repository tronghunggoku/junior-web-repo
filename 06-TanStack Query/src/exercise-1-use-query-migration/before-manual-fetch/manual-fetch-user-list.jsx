import { useEffect, useState } from 'react';
import { fetchUsers } from '../users-api.js';
import { UserListView } from '../user-list-view.jsx';

/**
 * ❌ BEFORE — fetch thủ công bằng useEffect + useState.
 * Vấn đề:
 *  - Mỗi instance tự gọi API riêng → 2 component = 2 request giống hệt.
 *  - StrictMode (dev) chạy effect 2 lần → mỗi instance thêm 1 request nữa.
 *  - Unmount rồi mount lại (đổi tab) → gọi lại từ đầu, không có cache.
 *  - Tự quản lý loading/error/race condition bằng tay.
 */
export function ManualFetchUserList({ title }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false; // chống race condition khi unmount trước khi request xong
    setIsLoading(true);

    fetchUsers()
      .then((data) => {
        if (!ignore) setUsers(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return <UserListView title={title} users={users} isLoading={isLoading} error={error} />;
}
