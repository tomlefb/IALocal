import { useMemo } from 'react';
import { MessageSquare } from 'lucide-react';
import type { Conversation } from '@/types';
import { ConversationItem } from './ConversationItem';

export interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onRename,
  onDelete,
}: ConversationListProps) {
  // Tri par date de mise à jour (plus récentes en haut)
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const dateA = a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt);
      const dateB = b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt);
      return dateB.getTime() - dateA.getTime();
    });
  }, [conversations]);

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
        <MessageSquare className="h-10 w-10 text-text-tertiary mb-3" />
        <p className="text-sm text-text-secondary">Aucune conversation</p>
        <p className="text-xs text-text-tertiary mt-1">
          Commence par en créer une !
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
      {sortedConversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeId}
          onClick={() => onSelect(conversation.id)}
          onRename={(newTitle) => onRename(conversation.id, newTitle)}
          onDelete={() => onDelete(conversation.id)}
        />
      ))}
    </div>
  );
}
