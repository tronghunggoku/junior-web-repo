# Phần 1: Closure, Array Methods & This Context

Tập hợp các bài tập và ví dụ thực hành sâu về 3 trụ cột cơ bản của JavaScript Core:
1. Closure: Đóng gói dữ liệu riêng tư (Private State), Caching (Memoization), Hàm sinh hàm (Currying/Factory).
2. Array Methods vs Vòng for: Ưu tiên declarative methods (map, filter, reduce, find, flatMap, some, every) thay thế vòng for lồng nhau.
3. this Binding: 5 cơ chế xác định context của this và các bẫy thực tế.

---

## Danh sách file mã nguồn

| File | Nội dung chính | Cách chạy |
| :--- | :--- | :--- |
| [`closure-exercises.js`](./closure-exercises.js) | Private Counter, memoize(fn), createCartStore, Currying | `node closure-exercises.js` |
| [`array-methods-exercises.js`](./array-methods-exercises.js) | Chuyển đổi Imperative sang Declarative, Aggregation, Group By | `node array-methods-exercises.js` |
| [`this-binding-explained.js`](./this-binding-explained.js) | 5 quy tắc Binding: Default, Implicit, Explicit, new, Arrow Function | `node this-binding-explained.js` |

---

## Tóm tắt kiến thức

### 1. Khi nào dùng Array Methods thay vì Vòng for?
- Nên dùng Array Methods:
  - Khi cần biến đổi toàn bộ mảng (map).
  - Khi cần lọc phần tử theo điều kiện (filter).
  - Khi cần tổng hợp dữ liệu thành 1 giá trị/object/map mới (reduce).
  - Code ngắn gọn, khai báo (declarative), dễ test và tránh side-effects.
- Khi nào Vòng for truyền thống tốt hơn?:
  - Khi cần ngắt vòng lặp sớm (break) ngay khi thỏa điều kiện (hoặc dùng find/some).
  - Khi xử lý mảng cực lớn đòi hỏi tối ưu bộ nhớ.
  - Khi xử lý logic bất đồng bộ tuần tự phức tạp với await trong từng bước.

### 2. Bảng tổng hợp this trong JavaScript
| Cơ chế Binding | Điều kiện kích hoạt | Ví dụ gọi hàm | Giá trị của this |
| :--- | :--- | :--- | :--- |
| Default | Gọi hàm thông thường | `fn()` | window (non-strict) / undefined (strict mode) |
| Implicit | Gọi qua đối tượng sở hữu | `obj.fn()` | obj đứng trước dấu chấm |
| Explicit | Gọi qua phương thức ép context | `fn.call(ctx)`, `fn.apply(ctx)`, `fn.bind(ctx)()` | Giá trị truyền vào ctx |
| new Binding | Gọi bằng toán tử new | `new Constructor()` | Object rỗng mới được khởi tạo |
| Lexical (Arrow) | Khai báo bằng arrow function | `const fn = () => {}` | Lấy theo this của scope bao quanh tại thời điểm định nghĩa |
