# 04 - JavaScript Core Mastery

Thư mục này tổng hợp các bài tập và kiến thức cốt lõi trong JavaScript hiện đại (ES6+), được chia thành 2 phần chính theo yêu cầu bài học.

---

## Cấu trúc thư mục

```text
04-JavaScript Core/
├── 01-closure-array-this/
│   ├── README.md
│   ├── closure-exercises.js
│   ├── array-methods-exercises.js
│   └── this-binding-explained.js
│
└── 02-async-eventloop-modules/
    ├── README.md
    ├── event-loop-closure-qa.md
    ├── fetch-comparison/
    │   ├── index.html
    │   ├── styles.css
    │   └── app.js
    └── modular-refactor/
        ├── before/
        │   └── monolith-app.js
        └── after/
            ├── index.html
            ├── styles.css
            └── src/
                ├── main.js
                ├── api/productApi.js
                ├── state/cartStore.js
                ├── utils/arrayHelpers.js
                ├── utils/formatters.js
                └── ui/productRenderer.js
```

---

## Cách chạy và kiểm thử

### 1. Kiểm tra phần 1 (Node.js):
```bash
cd "04-JavaScript Core/01-closure-array-this"
node closure-exercises.js
node array-methods-exercises.js
node this-binding-explained.js
```

### 2. Kiểm tra phần 2:
- Fetch Tuần tự vs Song song: Mở file `02-async-eventloop-modules/fetch-comparison/index.html` trong trình duyệt.
- Modular Refactor: Sử dụng Live Server hoặc mở `02-async-eventloop-modules/modular-refactor/after/index.html`.
