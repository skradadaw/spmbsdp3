interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="flex items-center justify-between relative mb-8 px-2" aria-label="Progress pendaftaran">
      {/* Progress Line */}
      <div className="absolute top-4 left-6 right-6 h-1 bg-border-light rounded-full z-0 overflow-hidden" aria-hidden="true">
        <div
          className="h-full bg-[var(--color-primary-500)] transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div
            key={stepNum}
            className="relative z-[1] flex flex-col items-center gap-2"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                isActive
                  ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-500)] text-white shadow-[0_0_15px_rgba(var(--color-primary-500-rgb),0.5)] scale-110'
                  : isCompleted
                    ? 'border-[var(--color-primary-500)] bg-white text-[var(--color-primary-500)]'
                    : 'border-border-light bg-white text-text-muted'
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              {isCompleted ? "✓" : stepNum}
            </div>
            <span className={`text-xs text-center hidden sm:block sm:absolute sm:top-12 sm:w-max transition-all ${
              isActive || isCompleted ? 'text-text font-bold' : 'text-text-secondary font-semibold'
            }`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
