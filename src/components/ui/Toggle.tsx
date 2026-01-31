import { useId } from 'react';
import { cn } from '@/utils';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  const id = useId();

  const handleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleChange();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full',
          'transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary',
          checked ? 'bg-accent' : 'bg-bg-tertiary',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg',
            'transform transition-transform duration-200 ease-in-out',
            'ring-0 translate-y-0.5',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          )}
        />
      </button>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'text-sm cursor-pointer select-none',
            disabled ? 'text-text-tertiary cursor-not-allowed' : 'text-text-secondary'
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}
