import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Conversation } from '@/types';
import { cn, formatRelativeTime } from '@/utils';
import { IconButton } from '@/components/ui';

export interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onRename: (newTitle: string) => void;
  onDelete: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  onRename,
  onDelete,
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(conversation.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: MouseEvent) => {
    e.stopPropagation();
    setEditValue(conversation.title);
    setIsEditing(true);
  };

  const handleRenameClick = (e: MouseEvent) => {
    e.stopPropagation();
    setEditValue(conversation.title);
    setIsEditing(true);
  };

  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Supprimer cette conversation ?')) {
      onDelete();
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitRename();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(conversation.title);
    }
  };

  const handleInputBlur = () => {
    submitRename();
  };

  const submitRename = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== conversation.title) {
      onRename(trimmed);
    }
    setIsEditing(false);
  };

  const relativeTime = formatRelativeTime(
    conversation.updatedAt instanceof Date
      ? conversation.updatedAt
      : new Date(conversation.updatedAt)
  );

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex flex-col gap-1 px-3 py-2.5 rounded-lg cursor-pointer',
        'transition-all duration-200',
        'animate-fade-in',
        isActive
          ? 'bg-surface-active border-l-2 border-accent'
          : 'hover:bg-surface-hover border-l-2 border-transparent'
      )}
    >
      {/* Titre */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'bg-bg-tertiary border border-accent rounded px-2 py-1',
            'text-sm text-text-primary',
            'focus:outline-none focus:ring-1 focus:ring-accent'
          )}
        />
      ) : (
        <span
          onDoubleClick={handleDoubleClick}
          className="text-sm font-medium text-text-primary truncate pr-14"
        >
          {conversation.title}
        </span>
      )}

      {/* Date relative */}
      <span className="text-xs text-text-tertiary">{relativeTime}</span>

      {/* Actions au hover (desktop) ou toujours visible sur mobile */}
      {!isEditing && (
        <div
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2',
            'flex items-center gap-0.5',
            'md:opacity-0 md:group-hover:opacity-100',
            'transition-opacity duration-200'
          )}
        >
          <IconButton
            icon={Pencil}
            size="sm"
            tooltip="Renommer"
            onClick={handleRenameClick}
            className="h-7 w-7"
          />
          <IconButton
            icon={Trash2}
            size="sm"
            tooltip="Supprimer"
            onClick={handleDeleteClick}
            className="h-7 w-7 hover:text-error"
          />
        </div>
      )}
    </div>
  );
}
