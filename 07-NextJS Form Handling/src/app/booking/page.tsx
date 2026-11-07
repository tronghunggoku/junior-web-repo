import type { Metadata } from 'next';
import { BookingForm } from '@/features/booking/components/booking-form';
import type { ProductOption } from '@/features/booking/booking-form-types';
import { getProduct, getProducts } from '@/lib/products-api';

/**
 * Chiến lược render: SSR (dynamic rendering)
 * - Trang đọc `searchParams` (?product=12 từ nút "Đặt lịch" ở trang chi tiết) → mỗi request render
 *   trên server với sản phẩm điền sẵn khác nhau, không thể build tĩnh 1 lần.
 * - Dữ liệu sản phẩm bên trong vẫn lấy từ Data Cache (revalidate 1 giờ) → SSR nhưng không gọi API mỗi lần.
 * - Phần form là Client Component; HTML của form vẫn được server render sẵn.
 */
export const metadata: Metadata = {
  title: 'Đặt lịch trải nghiệm',
  description: 'Đặt lịch tới showroom dùng thử sản phẩm trong 3 bước: thông tin liên hệ, chọn lịch hẹn, xác nhận.',
  alternates: { canonical: '/booking' },
  openGraph: { title: 'Đặt lịch trải nghiệm | TechNest Showroom', url: '/booking' },
};

type BookingPageProps = { searchParams: Promise<{ product?: string | string[] }> };

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { product } = await searchParams;
  // ?product=1&product=2 → lấy giá trị đầu; id rác / không tồn tại → bỏ qua, không crash
  const requestedId = Array.isArray(product) ? product[0] : product;

  const [products, requestedProduct] = await Promise.all([
    getProducts(30),
    requestedId ? getProduct(requestedId) : Promise.resolve(null),
  ]);

  const productOptions: ProductOption[] = products.map((item) => ({ id: String(item.id), title: item.title }));
  // Sản phẩm được yêu cầu nằm ngoài top 30 → thêm vào đầu danh sách
  if (requestedProduct && !productOptions.some((option) => option.id === String(requestedProduct.id))) {
    productOptions.unshift({ id: String(requestedProduct.id), title: requestedProduct.title });
  }

  return (
    <section aria-labelledby="booking-title">
      <h1 id="booking-title">Đặt lịch trải nghiệm</h1>
      {requestedId && !requestedProduct && (
        <p className="alert">Không tìm thấy sản phẩm #{requestedId} — vui lòng chọn sản phẩm khác ở bước 2.</p>
      )}
      <div className="booking-layout">
        <BookingForm productOptions={productOptions} preselectedProductId={requestedProduct ? String(requestedProduct.id) : ''} />
        <aside className="booking-card">
          <h2>Lưu ý</h2>
          <ul className="muted">
            <li>Showroom mở Thứ 2 – Thứ 7.</li>
            <li>Tối đa 5 người mỗi lượt.</li>
            <li>Dữ liệu đang nhập được giữ lại nếu bạn quay lại bước trước hoặc tải lại trang.</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
