import { useFormContext, useWatch } from 'react-hook-form';
import type { BookingFormState, ProductOption } from '../booking-form-types';
import { personalInfoSchema } from '../booking-schema';
import { fieldA11yProps } from './form-field';

type ReviewStepProps = {
  productOptions: ProductOption[];
  onEditStep: (step: number) => void;
};

/** Bước 3: xem lại toàn bộ dữ liệu, cho sửa từng phần, tick điều khoản rồi mới submit. */
export function ReviewStep({ productOptions, onEditStep }: ReviewStepProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BookingFormState>();
  const values = useWatch({ control });
  // Hiển thị đúng giá trị sẽ được gửi đi (đã trim / lowercase / bỏ dấu cách trong SĐT)
  const normalizedContact = personalInfoSchema.safeParse(values).data;
  const productTitle = productOptions.find((option) => option.id === values.productId)?.title ?? '—';
  const agreeError = errors.agreeToTerms?.message;

  return (
    <div>
      <div className="section-title">
        <h3>Thông tin liên hệ</h3>
        <button type="button" className="button ghost" onClick={() => onEditStep(0)}>
          Sửa
        </button>
      </div>
      <dl className="review-list">
        <dt>Họ tên</dt>
        <dd>{normalizedContact?.fullName ?? values.fullName}</dd>
        <dt>Email</dt>
        <dd>{normalizedContact?.email ?? values.email}</dd>
        <dt>Điện thoại</dt>
        <dd>{normalizedContact?.phone ?? values.phone}</dd>
      </dl>

      <div className="section-title">
        <h3>Lịch hẹn</h3>
        <button type="button" className="button ghost" onClick={() => onEditStep(1)}>
          Sửa
        </button>
      </div>
      <dl className="review-list">
        <dt>Sản phẩm</dt>
        <dd>{productTitle}</dd>
        <dt>Thời gian</dt>
        <dd>
          {values.timeSlot} · {values.date && new Date(`${values.date}T00:00:00`).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
        </dd>
        <dt>Số người</dt>
        <dd>{values.guests}</dd>
        {/* React tự escape → ghi chú chứa <script> chỉ hiện ra dạng text */}
        <dt>Ghi chú</dt>
        <dd>{values.note?.trim() || '—'}</dd>
      </dl>

      <div className="field">
        <div className="checkbox-field">
          <input
            type="checkbox"
            {...register('agreeToTerms')}
            {...fieldA11yProps('agreeToTerms', agreeError)}
          />
          <label htmlFor="agreeToTerms">
            Tôi đồng ý để showroom liên hệ xác nhận lịch hẹn qua email / điện thoại.
          </label>
        </div>
        {agreeError && (
          <p id="agreeToTerms-error" className="field-error" role="alert">
            {agreeError}
          </p>
        )}
      </div>
    </div>
  );
}
