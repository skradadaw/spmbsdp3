import { forwardRef, InputHTMLAttributes } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  as?: "input" | "textarea";
  rows?: number;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className = "", label, error, hint, required, id, as = "input", ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="form-group">
        {label && (
          <label
            htmlFor={inputId}
            className={`form-label ${required ? "form-label-required" : ""}`}
          >
            {label}
          </label>
        )}
        {as === "textarea" ? (
          <textarea
            id={inputId}
            ref={ref as any}
            className={`form-textarea ${error ? "form-textarea-error" : ""} ${className}`}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            required={required}
            {...(props as any)}
          />
        ) : (
          <input
            id={inputId}
            ref={ref as any}
            className={`form-input ${error ? "form-input-error" : ""} ${className}`}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            required={required}
            {...(props as any)}
          />
        )}
        {error && (
          <span className="form-error" id={`${inputId}-error`}>
            {error}
          </span>
        )}
        {hint && !error && (
          <span className="form-hint" id={`${inputId}-hint`}>
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
