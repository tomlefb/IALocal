import { X, Bot } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/utils';
import { IconButton } from '@/components/ui';
import { NewChatButton } from './NewChatButton';
import { ConversationList } from './ConversationList';

export interface SidebarProps {
  onClose: () => void;
  onNewChat: () => void;
}

export function Sidebar({ onClose, onNewChat }: SidebarProps) {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    renameConversation,
    deleteConversation,
  } = useChatStore();

  const handleSelect = (id: string) => {
    setActiveConversation(id);
    onClose(); // Ferme la sidebar sur mobile
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10">
            <Bot className="h-5 w-5 text-accent" />
          </div>
          <span className="font-semibold text-text-primary">IA Locale</span>
        </div>

        {/* Bouton fermer (mobile only) */}
        <IconButton
          icon={X}
          onClick={onClose}
          tooltip="Fermer"
          className="md:hidden"
        />
      </div>

      {/* New chat button */}
      <div className="px-3 py-3">
        <NewChatButton onClick={onNewChat} />
      </div>

      {/* Séparateur */}
      <div className="mx-3 border-t border-border-subtle" />

      {/* Liste des conversations */}
      <ConversationList
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={handleSelect}
        onRename={renameConversation}
        onDelete={deleteConversation}
      />

      {/* Footer */}
      <div
        className={cn(
          'px-4 py-3 border-t border-border-subtle',
          'text-xs text-text-tertiary text-center'
        )}
      >
        v1.0.0 — 100% local
      </div>
    </div>
  );
}
