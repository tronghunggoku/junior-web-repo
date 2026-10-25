import { useQuery } from '@tanstack/react-query';
import { usersListQueryOptions } from './users-queries.js';
import { UserListView } from '../user-list-view.jsx';

/**
 * ✅ AFTER — cùng UI, thay useEffect/useState bằng useQuery.
 * - Nhiều instance cùng queryKey → TanStack Query gộp (dedupe) thành 1 request.
 * - Trong staleTime: mount lại lấy cache ngay, không gọi API.
 * - loading / error / refetch / huỷ request (signal) có sẵn.
 */
export function QueryUserList({ title }) {
  const { data: users = [], isPending, error, isFetching, refetch } = useQuery(
    usersListQueryOptions(),
  );

  return (
    <UserListView
      title={title}
      users={users}
      isLoading={isPending}
      error={error?.message}
      isRefreshing={isFetching && !isPending}
      onRefresh={() => refetch()}
    />
  );
}
