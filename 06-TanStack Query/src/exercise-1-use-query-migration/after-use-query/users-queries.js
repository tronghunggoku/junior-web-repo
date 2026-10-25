import { queryOptions } from '@tanstack/react-query';
import { fetchUsers } from '../users-api.js';

/**
 * Query key factory + queryOptions: key và config khai báo 1 nơi,
 * mọi component dùng chung → cùng key = cùng cache = 1 request.
 */
export const userKeys = {
  all: ['users'],
  list: () => [...userKeys.all, 'list'],
};

export const usersListQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.list(),
    // Cố ý KHÔNG truyền `signal`: nếu queryFn dùng signal, khi observer cuối unmount
    // (StrictMode mount → unmount → mount) TanStack huỷ request rồi gọi lại => 2 request.
    // Không dùng signal thì request được giữ lại, kết quả vào cache cho lần mount sau.
    queryFn: () => fetchUsers(),
    // Danh sách user hiếm khi đổi trong 1 phiên làm việc → 5 phút là hợp lý.
    // Trong 5 phút: mount lại / đổi tab / component khác dùng → lấy cache, 0 request.
    staleTime: 5 * 60 * 1000,
  });
