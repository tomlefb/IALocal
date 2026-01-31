import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils';

export interface BadgeProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

const variantClasses = {
  success: 'badge-success',
  error: 'badge-error',
  warning: 'badge-warning',
  info: 'bg-accent/10 text-accent',
} as const;

export function Badge({
  variant = 'info',
  icon: Icon,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        variantClasses[variant],
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {children}
    </span>
  );
}
