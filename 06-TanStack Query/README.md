# 06 - TanStack Query

Hai bài tập TanStack Query v5 với API thật từ [dummyjson.com](https://dummyjson.com). App có sẵn **Network log** (cột phải) đếm mọi request đi qua `http-client` và đánh dấu đỏ request **TRÙNG** (cùng URL gọi lại trong 2 giây) — dùng song song với tab Network của DevTools.

| Bài | Nội dung |
| :-- | :-- |
| **1** | Chuyển component fetch thủ công (`useEffect + useState`) sang `useQuery`, cấu hình `staleTime`, kiểm tra hết request trùng |
| **2** | Danh sách lớn (~1454 quotes): phân trang (`keepPreviousData` + prefetch) và infinite scroll (`useInfiniteQuery`) |

---

## Cấu trúc thư mục

```text
06-TanStack Query/
└── src/
    ├── main.jsx                                  # QueryClientProvider + Devtools (giữ StrictMode)
    ├── app.jsx · styles.css
    ├── shared/
    │   ├── query-client.js                       # default options (staleTime, gcTime, retry…)
    │   ├── api/http-client.js                    # fetch wrapper, ghi log mọi request
    │   ├── api/request-log-store.js (+ .test)    # store đếm/phát hiện request trùng
    │   └── components/request-log-panel.jsx
    ├── exercise-1-use-query-migration/
    │   ├── users-api.js
    │   ├── user-list-view.jsx                    # UI dùng chung before/after
    │   ├── before-manual-fetch/manual-fetch-user-list.jsx
    │   ├── after-use-query/users-queries.js      # query key factory + queryOptions
    │   ├── after-use-query/query-user-list.jsx
    │   └── use-query-migration-demo.jsx
    └── exercise-2-large-list-pagination/
        ├── quotes-api.js (+ .test)               # fetch trang, tính tổng trang, getNextPageParam
        ├── quotes-queries.js                     # queryOptions / infiniteQueryOptions
        ├── paginated-quote-list.jsx
        ├── infinite-quote-list.jsx
        ├── quote-row.jsx
        └── large-list-demo.jsx
```

## Cách chạy

```bash
cd "06-TanStack Query"
npm install
npm run dev     # mở DevTools → Network, lọc "dummyjson"
npm test        # 7 unit test
npm run build
```

---

## Bài 1 — Fetch thủ công → `useQuery`

Cùng 1 danh sách user hiển thị ở **2 chỗ** (sidebar + bảng chính), như app thật.

```jsx
// ❌ Before
useEffect(() => {
  let ignore = false;
  fetchUsers().then((data) => !ignore && setUsers(data)) /* + loading, error… */;
  return () => { ignore = true; };
}, []);

// ✅ After
const { data: users = [], isPending, error } = useQuery(usersListQueryOptions());
```

### Cấu hình `staleTime`

| Nơi | Giá trị | Lý do |
| :-- | :-- | :-- |
| Default (`query-client.js`) | 1 phút | Mặc định của TanStack là `0` → mỗi lần mount là refetch. 1 phút đủ để gom các component mount gần nhau |
| `users` list | 5 phút | Danh sách thành viên hiếm khi đổi trong 1 phiên làm việc |
| `quotes` pages | 10 phút | Dữ liệu gần như tĩnh, quay lại trang cũ không cần gọi lại |
| `refetchOnWindowFocus` | `false` | Tránh request "lạ" khi chuyển tab trong lúc demo; app thật có thể bật lại |

### Kết quả kiểm tra (đo bằng Network log + `performance.getEntriesByType('resource')`)

| Kịch bản | Before (`useEffect`) | After (`useQuery`) |
| :-- | :-- | :-- |
| Load trang, 2 component cùng data | **4 request** (2 component × StrictMode chạy effect 2 lần), 3 trùng | **1 request**, 0 trùng |
| Unmount → mount lại (đổi trang) | Gọi lại từ đầu | **0 request** (cache còn fresh) |

> **Lưu ý `signal`:** nếu `queryFn` dùng `signal`, khi observer cuối cùng unmount TanStack sẽ **huỷ** request; StrictMode mount → unmount → mount nên thành 2 request (1 bị cancel). Vì vậy `queryFn` ở đây cố ý không dùng `signal` — request chạy xong và vào cache.

---

## Bài 2 — Danh sách lớn: phân trang / infinite

Dữ liệu: `GET /quotes?limit=20&skip=…` (1454 bản ghi, 73 trang).

### Phân trang — chuyển trang không load lại

- Mỗi trang 1 cache key: `['quotes', 'page', n]`.
- `placeholderData: keepPreviousData` → khi bấm "Sau", data trang cũ vẫn hiển thị (mờ đi) tới khi trang mới về → không nháy "Loading", không giật layout.
- `prefetchQuery` trang kế tiếp → bấm "Sau" thấy ngay; prefetch tự bỏ qua nếu cache còn fresh.
- Nút "Sau" bị khoá khi `isPlaceholderData` → không bấm dồn tạo request thừa.

### Infinite scroll

- `useInfiniteQuery` + `getNextPageParam` trả `undefined` khi hết dữ liệu → `hasNextPage = false`.
- `IntersectionObserver` trên phần tử sentinel (`rootMargin: 200px` để tải trước).
- Chỉ gọi `fetchNextPage()` khi `hasNextPage && !isFetchingNextPage` — vì `fetchNextPage` mặc định `cancelRefetch: true`, gọi khi đang fetch sẽ huỷ và gọi lại → trùng.

### Kết quả kiểm tra Network

| Thao tác | Request thực tế |
| :-- | :-- |
| Vào tab → trang 1 → 2 → 3 | `skip=0`, `skip=20`, `skip=40` + prefetch `skip=60` |
| Quay lại 3 → 2 → 1 | **0 request** (cache) |
| Infinite, cuộn 3 lần | `skip=0, 20, 40, 60` — mỗi skip đúng 1 lần, 0 trùng |
| Chuyển về lại Phân trang | **0 request** |

Mở **React Query Devtools** (nút góc dưới phải) để xem từng query key, trạng thái `fresh/stale` và thời điểm cache bị dọn (`gcTime`).
