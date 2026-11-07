import type { ReactNode } from 'react';

/** Props a11y gắn vào input: id, aria-invalid, aria-describedby trỏ tới hint + lỗi. */
export function fieldA11yProps(name: string, error?: string, hasHint = false) {
  const describedBy = [hasHint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(' ');
  return {
    id: name,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy || undefined,
  } as const;
}

type FormFieldProps = {
  name: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
};

/** Label + input + gợi ý + lỗi inline (role="alert" để screen reader đọc ngay khi lỗi xuất hiện). */
export function FormField({ name, label, error, hint, children }: FormFieldProps) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {children}
      {hint && (
        <span id={`${name}-hint`} className="field-hint">
          {hint}
        </span>
      )}
      {error && (
        <p id={`${name}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
