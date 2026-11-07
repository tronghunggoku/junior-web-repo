import Link from 'next/link';

type BookingSuccessProps = {
  bookingCode: string;
  productTitle: string;
  onNewBooking: () => void;
};

export function BookingSuccess({ bookingCode, productTitle, onNewBooking }: BookingSuccessProps) {
  return (
    <div className="booking-card" role="status">
      <div className="alert success">Đặt lịch thành công!</div>
      <h2>Mã đặt lịch: {bookingCode}</h2>
      <p>
        Showroom đã ghi nhận lịch trải nghiệm <strong>{productTitle}</strong>. Chúng tôi sẽ liên hệ xác nhận
        trong 24 giờ.
      </p>
      <div className="form-actions">
        <Link href="/products" className="button ghost">
          Xem thêm sản phẩm
        </Link>
        <button type="button" className="button" onClick={onNewBooking}>
          Đặt lịch mới
        </button>
      </div>
    </div>
  );
}
