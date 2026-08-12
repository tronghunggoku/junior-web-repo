# Bài Tập 02: Dev-fe-002 Semantic Web & Tailwind CSS

Thư mục này chứa bài tập thực hành về **HTML5 Semantic Web Standards**, **SEO Best Practices**, và **Tailwind CSS Utility-First Architecture**.

---

## 🎯 Mục Tiêu Bài Tập
1. **HTML5 Semantic Landmarks & SEO:**
   - Sử dụng đầy đủ các thẻ landmark chuẩn SEO: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
   - Heading phân cấp chuẩn mực (`<h1>` duy nhất per page, `<h2>`, `<h3>`), thẻ `alt` mô tả trực quan cho hình ảnh.
   - Thẻ Meta chuẩn SEO (Meta description, OpenGraph `og:title`, `og:image`, Twitter Cards).

2. **Tailwind CSS Clean Architecture & Utility Optimization:**
   - Thiết kế Mobile-First đáp ứng 3+ breakpoint (`sm:`, `md:`, `lg:`, `xl:`).
   - Tổ chức gom class lặp lại bằng `@apply` trong stylesheet.
   - Hàm helper `cn()` (`clsx` + `tailwind-merge`) hỗ trợ xử lý class động / điều kiện.

3. **Giao Diện Figma Hero & Card Components:**
   - Dựng Hero Section sang trọng, hiện đại.
   - Component hóa khối Card hiển thị tính năng tái sử dụng.
   - Tối ưu DOM sạch và pixel-perfect theo thiết kế.

---

## 📋 Rubric Đánh Giá Bài Tập
- ✅ **Chuẩn SEO/Semantic:** Landmark đầy đủ, meta chuẩn, image alt sắc nét.
- ✅ **Responsive Mobile-First:** Hoàn hảo trên Mobile, Tablet và Desktop.
- ✅ **Tailwind sạch:** Component hóa với `@apply` và helper `cn()`.
- ✅ **Pixel-Perfect:** Giao diện sắc nét, chuẩn UI/UX doanh nghiệp.

---

## 🏗️ Cấu Trúc HTML5 Semantic Landmarks
- `<header>`: Thanh tiêu đề & thương hiệu điều hướng.
- `<nav>`: Danh sách liên kết điều hướng chính (`aria-label="Điều hướng chính"`).
- `<main>`: Khung nội dung chính của trang web.
- `<section id="hero">`: Hero Section với thẻ `<h1>` duy nhất phục vụ SEO.
- `<section id="features">`: Lưới bài tập Component Cards tái sử dụng.
- `<section id="figma-block">`: Khối giao diện Figma Pixel-Perfect với `<figure>` & `<figcaption>`.
- `<aside id="testimonials">`: Nội dung phụ đánh giá bài nộp từ Mentor.
- `<footer>`: Chứa thông tin bản quyền và đường dẫn liên kết.

---

## 🛠️ Quy Chuẩn Tailwind CSS & Component Class
1. **Gom Class Lặp Với `@apply` (`src/styles.css`):**
   - `.btn-primary`: Styling nút bấm primary kèm hiệu ứng hover & shadow glow.
   - `.btn-outline`: Styling nút bấm viền mỏng responsive.
   - `.card-container`: Tái sử dụng giao diện thẻ Card có viền mờ và hover hiệu ứng nổi 3D.
   - `.badge-pill`: Badge nhãn trạng thái bài tập.

2. **Hàm Helper `cn()` (`src/utils/cn.js`):**
   - Sử dụng kết hợp `clsx` và `tailwind-merge` giúp ghép class điều kiện linh hoạt không bị xung đột utility.

---

## 🚀 Hướng Dẫn Chạy & Build Dự Án
```bash
# 1. Chuyển vào thư mục bài tập
cd 02-semantic-tailwind

# 2. Cài đặt dependencies (nếu chưa cài)
npm install

# 3. Chạy môi trường phát triển (Dev Server)
npm run dev

# 4. Biên dịch production
npm run build
```
