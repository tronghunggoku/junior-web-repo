import { useFormContext } from 'react-hook-form';
import type { BookingFormState } from '../booking-form-types';
import { FormField, fieldA11yProps } from './form-field';

/** Bước 1: thông tin liên hệ. */
export function PersonalInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BookingFormState>();

  return (
    <div className="form-grid">
      <FormField name="fullName" label="Họ và tên" error={errors.fullName?.message}>
        <input
          {...register('fullName')}
          {...fieldA11yProps('fullName', errors.fullName?.message)}
          autoComplete="name"
          placeholder="Nguyễn Văn A"
        />
      </FormField>
      <div className="form-grid two-columns">
        <FormField name="email" label="Email" error={errors.email?.message}>
          <input
            {...register('email')}
            {...fieldA11yProps('email', errors.email?.message)}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="ten@gmail.com"
          />
        </FormField>
        <FormField
          name="phone"
          label="Số điện thoại"
          error={errors.phone?.message}
          hint="Di động VN, có thể gõ dạng 0912 345 678 hoặc +84…"
        >
          <input
            {...register('phone')}
            {...fieldA11yProps('phone', errors.phone?.message, true)}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0912345678"
          />
        </FormField>
      </div>
    </div>
  );
}
