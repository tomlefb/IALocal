import { cn } from '@/utils';

export interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-2xl rounded-tl-sm',
        'bg-bubble-assistant w-fit max-w-[200px]',
        className
      )}
    >
      <div className="flex items-center gap-1" aria-label="En train de réfléchir">
        <span
          className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce"
          style={{ animationDelay: '0ms', animationDuration: '600ms' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce"
          style={{ animationDelay: '150ms', animationDuration: '600ms' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce"
          style={{ animationDelay: '300ms', animationDuration: '600ms' }}
        />
      </div>
      <span className="text-sm text-text-secondary">En train de réfléchir...</span>
    </div>
  );
}
