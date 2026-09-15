# Phần 2: Async JS, Event Loop & Modular Refactoring

Phần này tập trung vào lập trình bất đồng bộ hiện đại, hiểu sâu cơ chế hoạt động của JavaScript runtime engine, và thực hành cấu trúc mã nguồn theo chuẩn ES Modules.

---

## Danh sách thành phần

| Thư mục / File | Nội dung chính |
| :--- | :--- |
| [`fetch-comparison/`](./fetch-comparison) | Ứng dụng Dashboard đo lường và so sánh trực quan giữa Fetch tuần tự (Sequential) vs Fetch song song (Promise.all / Promise.allSettled). |
| [`event-loop-closure-qa.md`](./event-loop-closure-qa.md) | Bộ câu hỏi & trả lời phỏng vấn chuyên sâu (Q&A) về Event Loop (Call Stack, Microtask, Macrotask) và Closure (Scope chain, Memory leaks). |
| [`modular-refactor/`](./modular-refactor) | Dự án thực hành chia tách từ 1 file Monolith duy nhất sang Kiến trúc ES Modules đa tầng. |

---

## Điểm cốt lõi cần nắm vững

### 1. So sánh Fetch Tuần tự vs Song song (Promise.all)
- Tuần tự (Sequential):
  - Cú pháp: `for (const item of list) { await fetch(...) }`
  - Thời gian: T = t1 + t2 + ... + tn (Cộng dồn thời gian của tất cả các request).
  - Use-case: Khi request sau phụ thuộc vào kết quả của request trước (Dependent requests) hoặc cần rate-limiting / throttle.
- Song song (Parallel / Concurrent):
  - Cú pháp: `await Promise.all(list.map(item => fetch(...)))`
  - Thời gian: T ≈ max(t1, t2, ..., tn) (Chỉ bằng thời gian của request lâu nhất).
  - Use-case: Khi các request độc lập dữ liệu với nhau.
  - Xử lý lỗi: Promise.all sẽ fail-fast (bị reject ngay khi có 1 request lỗi). Dùng Promise.allSettled nếu muốn thu thập kết quả của tất cả dù có request thất bại.

---

### 2. Thứ tự ưu tiên trong JavaScript Event Loop
```text
[Call Stack] (Đồng bộ)
       ↓
[Microtask Queue] (Promise.then/catch, queueMicrotask, MutationObserver)
       ↓
[Render Step] (requestAnimationFrame, Style/Layout/Paint)
       ↓
[Macrotask Queue] (setTimeout, setInterval, I/O, UI Events)
```
Quy tắc: Event Loop sẽ vét sạch 100% Microtask Queue trước khi chuyển sang Macrotask tiếp theo.
