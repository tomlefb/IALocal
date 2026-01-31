import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';
import { Send, Square } from 'lucide-react';
import { cn } from '@/utils';
import { INPUT_MAX_HEIGHT } from '@/utils/constants';

export interface InputBarProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isGenerating?: boolean;
  disabled?: boolean;
}

export function InputBar({
  onSend,
  onStop,
  isGenerating = false,
  disabled = false,
}: InputBarProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = value.trim().length > 0 && !disabled && !isGenerating;

  // Auto-resize du textarea
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, INPUT_MAX_HEIGHT)}px`;
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleSend = useCallback(() => {
    if (canSend) {
      onSend(value.trim());
      setValue('');
      // Reset height après envoi
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [canSend, value, onSend]);

  const handleStop = useCallback(() => {
    onStop?.();
  }, [onStop]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter pour envoyer
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
    // Escape pour arrêter
    if (e.key === 'Escape' && isGenerating) {
      e.preventDefault();
      handleStop();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="border-t border-border-subtle bg-bg-primary/80 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto p-4">
        <div
          className={cn(
            'flex items-center gap-3 p-3 rounded-xl',
            'glass border border-border-subtle',
            'focus-within:border-accent focus-within:ring-1 focus-within:ring-accent',
            'transition-colors duration-200'
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ecris ton message..."
            disabled={disabled}
            rows={1}
            className={cn(
              'flex-1 w-full bg-transparent resize-none',
              'text-text-primary placeholder:text-text-tertiary',
              'focus:outline-none',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'leading-6 py-0.5'
            )}
            style={{ maxHeight: INPUT_MAX_HEIGHT, minHeight: '28px' }}
          />

          {isGenerating ? (
            <button
              onClick={handleStop}
              className={cn(
                'flex-shrink-0 p-2.5 rounded-lg',
                'bg-error hover:bg-error/80 text-white',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-bg-primary'
              )}
              aria-label="Arrêter la génération"
            >
              <Square className="h-5 w-5" fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                'flex-shrink-0 p-2.5 rounded-lg',
                'bg-accent hover:bg-accent-hover text-white',
                'transition-colors duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary'
              )}
              aria-label="Envoyer le message"
            >
              <Send className="h-5 w-5" />
            </button>
          )}
        </div>

        <p className="hidden sm:block text-xs text-text-tertiary mt-2 text-center">
          Ctrl+Enter pour envoyer
        </p>
      </div>
    </div>
  );
}
