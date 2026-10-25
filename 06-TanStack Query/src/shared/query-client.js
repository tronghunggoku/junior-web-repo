import { QueryClient } from '@tanstack/react-query';

/**
 * QueryClient dùng chung cả app. Default hợp lý cho dữ liệu ít thay đổi;
 * từng query có thể override staleTime riêng (xem *-queries.js).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 phút: trong khoảng này dùng cache, KHÔNG gọi lại API
      gcTime: 5 * 60 * 1000, // cache không còn ai dùng giữ thêm 5 phút rồi mới xoá
      refetchOnWindowFocus: false, // demo: tránh request "lạ" khi chuyển tab trình duyệt
      retry: 1,
    },
  },
});
