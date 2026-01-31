import { useRef, useEffect } from 'react';
import type { Message } from '@/types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

export interface MessageListProps {
  messages: Message[];
  onCopy?: (content: string) => void;
  onRegenerate?: (messageId: string) => void;
  isGenerating?: boolean;
}

export function MessageList({
  messages,
  onCopy,
  onRegenerate,
  isGenerating = false,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGenerating]);

  // Scroll aussi pendant le streaming (contenu qui change)
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.isStreaming && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-6"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onCopy={onCopy}
            onRegenerate={
              message.role === 'assistant' && onRegenerate
                ? () => onRegenerate(message.id)
                : undefined
            }
          />
        ))}

        {/* Typing indicator quand on génère sans message streaming visible */}
        {isGenerating && !messages[messages.length - 1]?.isStreaming && (
          <div className="flex gap-3">
            <div className="w-8" /> {/* Spacer pour alignement avec avatar */}
            <TypingIndicator />
          </div>
        )}

        {/* Anchor pour le scroll */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
