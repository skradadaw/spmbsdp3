import { forwardRef, InputHTMLAttributes } from "react";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  label?: string;
  error?: string;
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  (
    { label, error, options, name, required, value, onValueChange, ...props },
    ref
  ) => {
    return (
      <div className="form-group">
        {label && (
          <label
            className={`form-label mb-2 block ${required ? "form-label-required" : ""}`}
            id={name ? `${name}-label` : undefined}
          >
            {label}
          </label>
        )}
        <div
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-labelledby={name ? `${name}-label` : undefined}
        >
          {options.map((option) => {
            const id = `${name}-${option.value}`;
            const isSelected = value === option.value;
            
            return (
              <div key={option.value} className="relative">
                <input
                  type="radio"
                  id={id}
                  name={name}
                  value={option.value}
                  ref={ref}
                  checked={isSelected}
                  onChange={(e) => {
                    if (onValueChange) {
                      onValueChange(e.target.value);
                    }
                  }}
                  required={required}
                  aria-invalid={!!error}
                  className="peer sr-only"
                  {...props}
                />
                <label 
                  htmlFor={id}
                  className={`flex items-center justify-center px-3 py-1.5 text-sm rounded-md border cursor-pointer font-semibold transition-all duration-300 ${
                    isSelected 
                      ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-500)] text-white shadow-sm' 
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 peer-focus-visible:ring-2 ring-primary-500/50'
                  }`}
                >
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>
        {error && <span className="block mt-2 text-sm font-semibold text-red-500">{error}</span>}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";
