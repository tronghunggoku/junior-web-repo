'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { FormProvider, useForm, type Resolver } from 'react-hook-form';
import {
  BOOKING_STEP_FIELDS,
  bookingDetailsSchema,
  bookingSchema,
  confirmationSchema,
  findStepOfField,
  personalInfoSchema,
} from '../booking-schema';
import { BOOKING_STEP_TITLES, EMPTY_BOOKING_FORM, type BookingFormState, type ProductOption } from '../booking-form-types';
import { submitBookingAction } from '../submit-booking-action';
import { clearBookingDraft, useBookingDraft } from '../use-booking-draft';
import { BookingDetailsStep } from './booking-details-step';
import { BookingSuccess } from './booking-success';
import { PersonalInfoStep } from './personal-info-step';
import { ReviewStep } from './review-step';

const LAST_STEP = BOOKING_STEP_TITLES.length - 1;

// 1 resolver cho mỗi bước. raw: true giữ nguyên giá trị người dùng gõ trong form
// (chuẩn hoá trim/lowercase làm 1 lần bằng bookingSchema lúc submit).
const STEP_RESOLVERS = [
  zodResolver(personalInfoSchema, undefined, { raw: true }),
  zodResolver(bookingDetailsSchema, undefined, { raw: true }),
  zodResolver(confirmationSchema, undefined, { raw: true }),
] as unknown as Resolver<BookingFormState>[];

type BookingFormProps = { productOptions: ProductOption[]; preselectedProductId: string };

export function BookingForm({ productOptions, preselectedProductId }: BookingFormProps) {
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [formError, setFormError] = useState<string>();
  const [result, setResult] = useState<{ bookingCode: string; productTitle: string }>();

  // Resolver chỉ validate schema của BƯỚC HIỆN TẠI → field ở bước sau chưa nhập không báo lỗi.
  const stepResolver: Resolver<BookingFormState> = (values, context, options) =>
    STEP_RESOLVERS[stepRef.current](values, context, options);

  const form = useForm<BookingFormState>({
    mode: 'onBlur', // validate khi rời field — không làm phiền lúc đang gõ
    reValidateMode: 'onChange', // đã báo lỗi thì sửa tới đâu cập nhật tới đó
    defaultValues: { ...EMPTY_BOOKING_FORM, productId: preselectedProductId },
    resolver: stepResolver,
  });
  const { handleSubmit, trigger, setError, reset, formState } = form;

  const goToStep = (nextStep: number) => {
    stepRef.current = nextStep;
    setStep(nextStep);
  };

  useBookingDraft(form, step, goToStep, preselectedProductId);

  // Đổi bước → đưa focus về tiêu đề bước (bàn phím / screen reader không bị lạc)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const goNext = async () => {
    const isStepValid = await trigger([...BOOKING_STEP_FIELDS[step]], { shouldFocus: true });
    if (isStepValid) goToStep(Math.min(step + 1, LAST_STEP));
  };

  const onFinalSubmit = async (values: BookingFormState) => {
    setFormError(undefined);
    // Validate TOÀN BỘ dữ liệu lần cuối (phòng nháp cũ / sửa bước trước) + chuẩn hoá giá trị
    const parsed = bookingSchema.safeParse(values);
    if (!parsed.success) {
      const firstField = String(parsed.error.issues[0].path[0]);
      goToStep(findStepOfField(firstField));
      for (const issue of parsed.error.issues) {
        setError(String(issue.path[0]) as keyof BookingFormState, { message: issue.message });
      }
      return;
    }

    const response = await submitBookingAction(parsed.data);
    if (!response.ok) {
      const fields = Object.keys(response.fieldErrors);
      if (fields.length > 0) goToStep(findStepOfField(fields[0]));
      for (const [field, message] of Object.entries(response.fieldErrors)) {
        setError(field as keyof BookingFormState, { message });
      }
      setFormError(response.formError);
      return;
    }
    clearBookingDraft();
    setResult({ bookingCode: response.bookingCode, productTitle: response.productTitle });
  };

  // Enter ở bước 1–2 = "Tiếp tục" (không submit sớm); chỉ bước cuối mới submit thật
  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (step < LAST_STEP) {
      event.preventDefault();
      void goNext();
      return;
    }
    void handleSubmit(onFinalSubmit)(event);
  };

  if (result) {
    return (
      <BookingSuccess
        {...result}
        onNewBooking={() => {
          reset(EMPTY_BOOKING_FORM);
          goToStep(0);
          setResult(undefined);
        }}
      />
    );
  }

  return (
    <FormProvider {...form}>
      <form className="booking-card" onSubmit={handleFormSubmit} noValidate>
        <ol className="stepper" aria-label="Các bước đặt lịch">
          {BOOKING_STEP_TITLES.map((title, index) => (
            <li
              key={title}
              data-state={index < step ? 'done' : index === step ? 'current' : 'todo'}
              aria-current={index === step ? 'step' : undefined}
            >
              {index + 1}. {title}
            </li>
          ))}
        </ol>
        <h2 ref={headingRef} tabIndex={-1}>
          Bước {step + 1}: {BOOKING_STEP_TITLES[step]}
        </h2>

        {formError && (
          <div className="alert" role="alert">
            {formError}
          </div>
        )}

        {step === 0 && <PersonalInfoStep />}
        {step === 1 && <BookingDetailsStep productOptions={productOptions} />}
        {step === 2 && <ReviewStep productOptions={productOptions} onEditStep={goToStep} />}

        <div className="form-actions">
          <button
            type="button"
            className="button ghost"
            onClick={() => goToStep(step - 1)}
            disabled={step === 0 || formState.isSubmitting}
          >
            ← Quay lại
          </button>
          {step < LAST_STEP ? (
            <button type="submit" className="button">
              Tiếp tục →
            </button>
          ) : (
            // isSubmitting khoá nút → double-click không gửi 2 lần
            <button type="submit" className="button" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? 'Đang gửi…' : 'Xác nhận đặt lịch'}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
