import {
  useEffect,
  useRef,
  type ReactNode,
  type MouseEvent,
  type KeyboardEvent,
} from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils';
import { IconButton } from './IconButton';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
} as const;

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  // Garder onCloseRef à jour sans déclencher l'effet
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (isOpen) {
      // Focus initial sur la modal seulement à l'ouverture
      previousActiveElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();

      const handleKeyDown = (e: globalThis.KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCloseRef.current();
        }

        // Focus trap
        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen]);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Prevent event bubbling for tab navigation
    if (e.key === 'Tab') {
      e.stopPropagation();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onKeyDown={handleModalKeyDown}
        className={cn(
          'relative w-full bg-surface border border-border-subtle rounded-xl shadow-2xl',
          'animate-fade-in',
          sizeClasses[size]
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-text-primary"
          >
            {title}
          </h2>
          <IconButton
            icon={X}
            size="sm"
            tooltip="Fermer"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
