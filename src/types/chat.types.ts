// === MESSAGES ===

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

// === CONVERSATIONS ===

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  systemPrompt?: string;
  createdAt: Date;
  updatedAt: Date;
}

// === HELPERS ===

export function createMessage(
  role: Message['role'],
  content: string,
  isStreaming = false
): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
    isStreaming,
  };
}

export function createConversation(model: string, systemPrompt?: string): Conversation {
  return {
    id: crypto.randomUUID(),
    title: 'Nouvelle conversation',
    messages: [],
    model,
    systemPrompt,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
