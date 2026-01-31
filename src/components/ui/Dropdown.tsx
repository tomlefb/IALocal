import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, items, align = 'left' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const handleItemKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    item: DropdownItem,
    index: number
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleItemClick(item);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = index + 1 < items.length ? index + 1 : 0;
      const buttons = dropdownRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]'
      );
      buttons?.[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = index - 1 >= 0 ? index - 1 : items.length - 1;
      const buttons = dropdownRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]'
      );
      buttons?.[prevIndex]?.focus();
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="inline-flex"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={cn(
            'absolute z-50 mt-2 min-w-[160px] py-1',
            'bg-surface border border-border-subtle rounded-lg shadow-xl',
            'animate-slide-up',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => handleItemKeyDown(e, item, index)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2 text-sm text-left',
                  'transition-colors duration-150',
                  item.disabled
                    ? 'text-text-tertiary cursor-not-allowed'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                )}
              >
                {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
