import { useId } from 'react';
import { cn } from '@/utils';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  disabled = false,
}: SliderProps) {
  const id = useId();

  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label
              htmlFor={id}
              className={cn(
                'text-sm',
                disabled ? 'text-text-tertiary' : 'text-text-secondary'
              )}
            >
              {label}
            </label>
          )}
          {showValue && (
            <span
              className={cn(
                'text-sm font-mono tabular-nums',
                disabled ? 'text-text-tertiary' : 'text-text-primary'
              )}
            >
              {value}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'w-full h-2 appearance-none cursor-pointer rounded-full',
            'bg-bg-tertiary',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary',
            disabled && 'opacity-50 cursor-not-allowed',
            // Webkit styling
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:w-4',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-white',
            '[&::-webkit-slider-thumb]:shadow-md',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:duration-150',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            disabled && '[&::-webkit-slider-thumb]:cursor-not-allowed',
            // Firefox styling
            '[&::-moz-range-thumb]:h-4',
            '[&::-moz-range-thumb]:w-4',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-white',
            '[&::-moz-range-thumb]:border-0',
            '[&::-moz-range-thumb]:shadow-md',
            '[&::-moz-range-thumb]:cursor-pointer',
            disabled && '[&::-moz-range-thumb]:cursor-not-allowed',
            '[&::-moz-range-track]:bg-transparent'
          )}
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #1f1f1f ${percentage}%, #1f1f1f 100%)`,
          }}
        />
      </div>
    </div>
  );
}
