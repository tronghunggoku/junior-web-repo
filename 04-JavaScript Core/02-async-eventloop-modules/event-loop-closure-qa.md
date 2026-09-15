# Bộ tài liệu Q&A chuyên sâu: Event Loop & Closure

Tài liệu chuẩn bị câu hỏi & câu trả lời (Q&A) phỏng vấn về Event Loop, Asynchronous Execution và Closure Memory Lifecycle trong JavaScript Core.

---

## PHẦN 1: EVENT LOOP & ASYNCHRONOUS JAVASCRIPT

### Câu 1: JavaScript là ngôn ngữ đơn luồng (single-threaded), vậy tại sao nó có thể xử lý các tác vụ bất đồng bộ (Non-blocking I/O)?
**Trả lời:**
- JavaScript Engine (như Google V8) chỉ có duy nhất 1 Call Stack và 1 Memory Heap (đơn luồng thực thi).
- Môi trường runtime (Trình duyệt hoặc Node.js) cung cấp thêm:
  1. Web APIs / C++ APIs: Xử lý các tác vụ như fetch/AJAX, setTimeout, DOM events, File I/O trên các luồng nền riêng biệt của hệ điều hành.
  2. Task Queues: Nơi chứa các hàm callback sẵn sàng được thực thi khi tác vụ nền hoàn thành.
  3. Event Loop: Cơ chế giám sát Call Stack. Khi Call Stack trống, Event Loop sẽ lấy callback từ Queue đưa vào Call Stack để thực thi.

---

### Câu 2: Sự khác biệt giữa Microtask Queue và Macrotask (Task) Queue là gì? Thứ tự ưu tiên ra sao?
**Trả lời:**

| Tiêu chí | Microtask Queue | Macrotask Queue (Task Queue) |
| :--- | :--- | :--- |
| **Nguồn gốc** | `Promise.then/catch/finally`, `queueMicrotask()`, `MutationObserver`, `process.nextTick` (Node.js) | `setTimeout`, `setInterval`, `setImmediate`, I/O, UI rendering events, `requestAnimationFrame` |
| **Độ ưu tiên** | **Cực cao**: Được ưu tiên thực thi ngay lập tức khi Call Stack vừa trống. | **Thấp hơn**: Chỉ thực thi 1 task tại một thời điểm sau khi toàn bộ Microtask đã hoàn thành. |
| **Cơ chế xử lý** | Event Loop sẽ vét sạch toàn bộ tất cả microtasks trong hàng đợi trước khi chuyển sang tác vụ khác. | Event Loop chỉ lấy đúng 1 macrotask ra xử lý, sau đó kiểm tra lại Microtask Queue trước khi render hoặc lấy macrotask tiếp theo. |

---

### Câu 3: Dự đoán chính xác thứ tự in ra console của đoạn code sau và giải thích chi tiết:

```javascript
console.log('1. Script Start');

setTimeout(() => {
  console.log('2. setTimeout Callback');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('3. Promise Callback 1');
  })
  .then(() => {
    console.log('4. Promise Callback 2');
  });

queueMicrotask(() => {
  console.log('5. queueMicrotask Callback');
});

console.log('6. Script End');
```

**Đáp án & Thứ tự thực thi:**
```text
1. Script Start
6. Script End
3. Promise Callback 1
5. queueMicrotask Callback
4. Promise Callback 2
2. setTimeout Callback
```

**Giải thích chi tiết từng bước:**
1. Đồng bộ (Call Stack):
   - `console.log('1. Script Start')` thực thi ngay -> in `1. Script Start`.
   - `setTimeout(..., 0)` được gửi tới Web APIs, callback được đưa vào Macrotask Queue.
   - `Promise.resolve().then(...)` đưa callback 1 vào Microtask Queue.
   - `queueMicrotask(...)` đưa callback 5 vào Microtask Queue.
   - `console.log('6. Script End')` thực thi ngay -> in `6. Script End`.
   - Call Stack lúc này đã trống.
2. Xử lý Microtask Queue (Ưu tiên số 1):
   - Lấy `Promise Callback 1` ra thực thi -> in `3. Promise Callback 1`. Phương thức `.then()` tiếp theo đẩy `Promise Callback 2` vào cuối Microtask Queue.
   - Lấy `queueMicrotask Callback` ra thực thi -> in `5. queueMicrotask Callback`.
   - Lấy `Promise Callback 2` ra thực thi -> in `4. Promise Callback 2`.
   - Microtask Queue lúc này đã trống hoàn toàn.
3. Xử lý Macrotask Queue:
   - Event Loop lấy 1 task từ Macrotask Queue: `setTimeout Callback` -> in `2. setTimeout Callback`.

---

## PHẦN 2: CLOSURE & MEMORY LIFECYCLE

### Câu 4: Closure là gì? Nó được hình thành khi nào và hoạt động như thế nào?
**Trả lời:**
- Closure là sự kết hợp giữa một hàm và môi trường từ vựng (Lexical Environment) nơi hàm đó được khai báo.
- Closure cho phép một hàm con truy cập được các biến của hàm cha ngay cả khi hàm cha đã kết thúc và đã bị pop ra khỏi Call Stack.
- Cơ chế: Khi JavaScript Engine phát hiện hàm bên trong tham chiếu tới biến ở hàm bên ngoài, nó sẽ lưu trữ biến đó trong Heap Memory (dưới dạng Closure Scope), giúp biến tồn tại đến khi không còn hàm nào tham chiếu tới nữa.

---

### Câu 5: Nêu 4 ứng dụng thực tế phổ biến nhất của Closure trong dự án?
**Trả lời:**
1. Data Encapsulation & Private State: Tạo các biến không thể bị sửa đổi hoặc truy cập trực tiếp từ bên ngoài mà chỉ qua getter/setter.
2. Memoization / Caching: Lưu trữ kết quả của các phép tính nặng dựa trên tham số đầu vào trong biến cache riêng biệt.
3. Function Factory & Currying: Tạo các hàm chuyên biệt từ một hàm tổng quát.
4. Event Handlers & Debounce / Throttle: Giữ lại biến timerId hoặc state giữa các lần trigger sự kiện mà không cần biến toàn cục.

---

### Câu 6: Closure có gây rò rỉ bộ nhớ (Memory Leak) không? Làm sao để phòng tránh?
**Trả lời:**
- Có thể gây Memory Leak: Nếu hàm closure giữ tham chiếu đến đối tượng lớn và hàm closure đó được gán vào biến toàn cục hoặc Event Listener tồn tại mãi mãi mà không được dọn dẹp, Garbage Collector sẽ không thể thu hồi vùng nhớ này.
- Cách khắc phục:
  1. Gỡ bỏ Event Listener khi component unmount (`removeEventListener`).
  2. Gán biến tham chiếu về `null` khi không còn sử dụng.
  3. Sử dụng `WeakMap` hoặc `WeakSet` nếu cần lưu metadata của object mà không ngăn cản Garbage Collector dọn dẹp.
