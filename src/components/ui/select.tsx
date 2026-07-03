import { forwardRef, SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = "",
      label,
      error,
      hint,
      required,
      id,
      options,
      placeholder,
      ...props
    },
    ref
  ) => {
    const selectId = id || props.name;

    return (
      <div className="form-group">
        {label && (
          <label
            htmlFor={selectId}
            className={`form-label ${required ? "form-label-required" : ""}`}
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`form-select ${error ? "form-select-error" : ""} ${className}`}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
          }
          required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="form-error" id={`${selectId}-error`}>
            {error}
          </span>
        )}
        {hint && !error && (
          <span className="form-hint" id={`${selectId}-hint`}>
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
