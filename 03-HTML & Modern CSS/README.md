# BÀI TẬP VỀ NHÀ 03: HTML SEMANTIC & MODERN CSS PRICING SECTION

Chào mừng bạn đến với module thực hành **HTML5 Semantics** và **Modern CSS Architecture (BEM & Flex/Grid)**. 
Tác giả: **Nguyễn Trọng Hùng** - *Junior Frontend Engineer*.
Repository này giải quyết toàn diện 2 bài tập theo chuẩn mực kỹ thuật cao.

---

## 📑 MỤC LỤC
1. [Bài 1: Khung HTML Ngữ Nghĩa & Phân Tích 5 Thẻ Cốt Lõi](#bài-1-khung-html-ngữ-nghĩa--phân-tích-5-thẻ-cốt-lõi)
2. [Bài 2: Pricing Section Chuẩn BEM & Modern CSS](#bài-2-pricing-section-chuẩn-bem--modern-css)
3. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
4. [Hướng Dẫn Chạy Thử](#hướng-dẫn-chạy-thử)

---

## BÀI 1: KHUNG HTML NGỮ NGHĨA & PHÂN TÍCH 5 THẺ CỐT LÕI

### 1. Vấn Đề Của "Div Soup"
Trong HTML truyền thống, lập trình viên thường dùng `<div>` cho tất cả mọi thứ (`<div class="header">`, `<div class="nav">`, `<div class="post">`). Điều này dẫn đến:
- **Kém tiếp cận (Accessibility - a11y):** Screen reader (trình đọc màn hình cho người khiếm thị) không thể phân biệt được đâu là nội dung chính, đâu là menu điều hướng.
- **Kém SEO:** Google bot không xác định được trọng tâm của trang web.
- **Khó bảo trì:** Cây DOM lồng nhau quá nhiều lớp `<div>` không mang ý nghĩa ngữ cảnh.

### 2. Liệt Kê 5 Thẻ Ngữ Nghĩa & Thời Điểm Sử Dụng

Dưới đây là 5 thẻ ngữ nghĩa tiêu biểu nhất được áp dụng trong trang giới thiệu bản thân:

| STT | Thẻ Ngữ Nghĩa | Ý Nghĩa Ngữ Nghĩa | Khi Nào Nên Dùng? | Khi Nào KHÔNG Nên Dùng? |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `<main>` | Vùng chứa nội dung cốt lõi, duy nhất và quan trọng nhất của toàn bộ tài liệu web. | Dùng để bọc toàn bộ nội dung chính của trang (sau header và trước footer). Mỗi trang chỉ được có **duy nhất 1 thẻ `<main>`** hiển thị. | Không dùng trong `<header>`, `<footer>`, `<aside>` hoặc lặp lại nhiều lần trên một trang. |
| **2** | `<section>` | Một phân đoạn tài liệu có liên kết theo cùng một chủ đề (thematic grouping), thường có tiêu đề riêng (`<h2>` - `<h6>`). | Dùng để chia trang thành các khu vực nội dung lớn như: "Giới thiệu bản thân", "Kỹ năng chuyên môn", "Dự án tiêu biểu", "Kinh nghiệm làm việc". | Không dùng chỉ để bọc style CSS hoặc căn giữa giao diện (khi đó nên dùng `<div>`). Không dùng nếu nội dung bên trong không có mối liên kết thành một chủ đề rõ ràng. |
| **3** | `<article>` | Một khối nội dung độc lập, tự trọn vẹn ý nghĩa và có thể tái sử dụng hoặc phân phối độc lập (syndicated). | Dùng cho từng Card dự án trong danh mục sản phẩm, từng bài blog, từng bình luận, hoặc từng testimonial đánh giá của khách hàng. | Không dùng để nhóm các thành phần vụn vặt phụ thuộc lẫn nhau. Nếu tách nội dung đó ra khỏi trang web mà nó không còn ý nghĩa độc lập, hãy dùng `<section>` hoặc thẻ khác. |
| **4** | `<figure>` & `<figcaption>` | Đại diện cho nội dung trực quan độc lập (ảnh, biểu đồ, đoạn code, trích dẫn) kèm theo phần chú thích giải thích ngữ nghĩa. | Dùng khi hiển thị ảnh đại diện (avatar), ảnh chụp màn hình dự án, sơ đồ kỹ thuật mà có kèm chú thích giải nghĩa liên quan trực tiếp đến luồng nội dung. | Không dùng cho các icon trang trí, logo header, hoặc hình nền thuần túy mang tính thẩm mỹ (visual decoration). |
| **5** | `<aside>` | Khối nội dung liên quan gián tiếp, mang tính bổ trợ, mở rộng hoặc tách biệt khỏi luồng nội dung chính. | Dùng cho thanh sidebar, bảng thông tin nhanh ("Quick Facts" về tác giả), danh ngôn triết lý làm việc, danh sách liên kết ngoài, hoặc callout ghi chú. | Không dùng cho nội dung chính yếu mà người đọc bắt buộc phải xem để hiểu bài viết. |

> **Thẻ bổ trợ cực hay:**
> - `<time datetime="2024-05">`: Giúp bot và trình duyệt nhận diện chính xác thời gian thực (ví dụ: mốc thời gian kinh nghiệm).
> - `<address>`: Dành riêng cho thông tin liên hệ của tác giả/chủ sở hữu trang web.

---

## BÀI 2: PRICING SECTION CHUẨN BEM & MODERN CSS

### 1. Phương Pháp BEM (Block - Element - Modifier)
BEM là quy chuẩn đặt tên class giúp code CSS có tính module hóa cao, tránh xung đột độ ưu tiên (specificity) và dễ mở rộng khi làm việc nhóm:

- **Block:** Thực thể độc lập có ý nghĩa tự thân:
  - Ví dụ: `.pricing`, `.pricing-card`
- **Element:** Thành phần trực thuộc Block, không có ý nghĩa khi đứng độc lập:
  - Cú pháp: `Block__Element`
  - Ví dụ: `.pricing-card__header`, `.pricing-card__price`, `.pricing-card__features`, `.pricing-card__button`
- **Modifier:** Cờ (flag) thay đổi trạng thái, giao diện hoặc hành vi của Block hoặc Element:
  - Cú pháp: `Block--Modifier` hoặc `Block__Element--Modifier`
  - Ví dụ: `.pricing-card--popular` (gói nổi bật), `.pricing-card__item--disabled` (tính năng bị vô hiệu hóa)

### 2. Kỹ Thuật Layout & Responsive (Flexbox & CSS Grid)
- **CSS Grid:** Quản trị bố cục tổng thể của lưới thẻ:
  ```css
  .pricing__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
    gap: 2rem;
    align-items: stretch;
  }
  ```
- **Flexbox:** Quản trị chiều dọc bên trong từng Card để nút CTA luôn dính sát mép dưới và thẳng hàng nhau hoàn hảo:
  ```css
  .pricing-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  ```

### 3. Hiệu Ứng Hover Mượt Mà (60FPS Micro-interactions)
- Sử dụng `transform: translateY(-8px)` kết hợp `box-shadow` nhiều lớp (layered shadow).
- Tối ưu GPU bằng `will-change: transform, box-shadow` và timing-function tự nhiên `cubic-bezier(0.16, 1, 0.3, 1)`.
- Gói `popular` có hiệu ứng gradient border phát sáng tinh tế khi hover.

---

## CẤU TRÚC THƯ MỤC

```text
03-HTML & Modern CSS/
├── README.md                 # Tài liệu lý thuyết & phân tích chuyên sâu (file này)
├── index.html                # Trang Portal trung tâm xem demo cả 2 bài tập
├── bai-1-portfolio/
│   ├── index.html            # Khung HTML ngữ nghĩa cá nhân (100% chuẩn a11y & SEO)
│   └── style.css             # Style hiện đại, thanh lịch
└── bai-2-pricing/
    ├── index.html            # Pricing Section chuẩn HTML & BEM naming
    └── style.css             # Grid/Flex layout, biến CSS tokens, hiệu ứng hover mượt mà
```

---

## HƯỚNG DẪN CHẠY THỬ
1. **Cách 1:** Mở trực tiếp file `index.html` trong thư mục `03-HTML & Modern CSS` trên bất kỳ trình duyệt nào.
2. **Cách 2:** Dùng tiện ích mở rộng **Live Server** trên VSCode/IDE để tận hưởng live-reload tự động.
