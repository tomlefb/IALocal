import { ButtonHTMLAttributes, forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils';

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'ghost' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

const sizeClasses = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
} as const;

const iconSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      variant = 'ghost',
      size = 'md',
      tooltip,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        title={tooltip}
        className={cn(
          'btn-icon',
          sizeClasses[size],
          variant === 'primary' &&
            'bg-accent text-white hover:bg-accent-hover hover:text-white',
          className
        )}
        {...props}
      >
        <Icon className={iconSizeClasses[size]} aria-hidden="true" />
        {tooltip && <span className="sr-only">{tooltip}</span>}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
