/**
 * loading.tsx — Next.js tự bọc page trong <Suspense fallback={<Loading />}>.
 * Hiện skeleton ngay khi điều hướng tới /products (hoặc /products/[id] chưa có cache)
 * trong lúc Server Component đang lấy dữ liệu → người dùng không thấy màn hình trắng.
 */
export default function ProductsLoading() {
  return (
    <section aria-busy="true" aria-label="Đang tải sản phẩm">
      <div className="skeleton" style={{ height: 36, width: 200, marginBlock: '20px 12px' }} />
      <div className="skeleton" style={{ height: 18, width: 280, marginBottom: 24 }} />
      <ul className="product-grid">
        {Array.from({ length: 8 }, (_, index) => (
          <li key={index} className="product-card">
            <div className="skeleton" style={{ height: 180 }} />
            <div className="skeleton" style={{ height: 16, width: '50%' }} />
            <div className="skeleton" style={{ height: 20, width: '80%' }} />
            <div className="skeleton" style={{ height: 20, width: '30%' }} />
          </li>
        ))}
      </ul>
    </section>
  );
}
