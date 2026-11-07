import { useFormContext, useWatch } from 'react-hook-form';
import { MAX_DAYS_AHEAD, MAX_GUESTS, MAX_NOTE_LENGTH, TIME_SLOTS } from '../booking-schema';
import type { BookingFormState, ProductOption } from '../booking-form-types';
import { getVietnamToday } from '../vietnam-date-utils';
import { FormField, fieldA11yProps } from './form-field';

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Bước 2: chọn sản phẩm, ngày, giờ, số người, ghi chú. */
export function BookingDetailsStep({ productOptions }: { productOptions: ProductOption[] }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BookingFormState>();
  const noteLength = useWatch({ control, name: 'note' })?.length ?? 0;
  const today = getVietnamToday();

  return (
    <div className="form-grid">
      <FormField name="productId" label="Sản phẩm muốn trải nghiệm" error={errors.productId?.message}>
        <select {...register('productId')} {...fieldA11yProps('productId', errors.productId?.message)}>
          <option value="">— Chọn sản phẩm —</option>
          {productOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          ))}
        </select>
      </FormField>

      <div className="form-grid two-columns">
        {/* min/max chỉ là gợi ý cho date picker — luật thật nằm ở Zod (người dùng vẫn gõ tay được) */}
        <FormField name="date" label="Ngày hẹn" error={errors.date?.message} hint="Thứ 2 – Thứ 7, trong 60 ngày tới">
          <input
            {...register('date')}
            {...fieldA11yProps('date', errors.date?.message, true)}
            type="date"
            min={today}
            max={addDays(today, MAX_DAYS_AHEAD)}
          />
        </FormField>
        <FormField name="timeSlot" label="Khung giờ" error={errors.timeSlot?.message}>
          <select {...register('timeSlot')} {...fieldA11yProps('timeSlot', errors.timeSlot?.message)}>
            <option value="">— Chọn giờ —</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField name="guests" label="Số người tham gia" error={errors.guests?.message} hint={`1 – ${MAX_GUESTS} người`}>
        <input
          // valueAsNumber: ô trống → NaN → Zod báo "Vui lòng nhập số người"
          {...register('guests', { valueAsNumber: true })}
          {...fieldA11yProps('guests', errors.guests?.message, true)}
          type="number"
          inputMode="numeric"
          min={1}
          max={MAX_GUESTS}
        />
      </FormField>

      <FormField
        name="note"
        label="Ghi chú (không bắt buộc)"
        error={errors.note?.message}
        hint={`${noteLength}/${MAX_NOTE_LENGTH} ký tự`}
      >
        <textarea {...register('note')} {...fieldA11yProps('note', errors.note?.message, true)} rows={4} />
      </FormField>
    </div>
  );
}
