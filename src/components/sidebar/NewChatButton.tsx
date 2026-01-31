import { Plus } from 'lucide-react';
import { cn } from '@/utils';

export interface NewChatButtonProps {
  onClick: () => void;
}

export function NewChatButton({ onClick }: NewChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-center gap-2',
        'btn-primary py-2.5'
      )}
    >
      <Plus className="h-5 w-5" />
      <span>Nouvelle conversation</span>
    </button>
  );
}
