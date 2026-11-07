import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="prose">
      <h1>Không tìm thấy trang</h1>
      <p className="muted">Sản phẩm hoặc trang bạn tìm không tồn tại hoặc đã bị gỡ.</p>
      <Link href="/products" className="button">
        Quay lại danh sách sản phẩm
      </Link>
    </section>
  );
}
