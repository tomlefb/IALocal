import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Conversation, Message } from '@/types/chat.types';
import { createConversation, createMessage } from '@/types/chat.types';
import { storageService } from '@/services/storage.service';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  isHydrated: boolean;
}

interface ChatActions {
  createConversation: (model: string, systemPrompt?: string) => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  setMessageStreaming: (conversationId: string, messageId: string, isStreaming: boolean) => void;
  renameConversation: (id: string, title: string) => void;
  clearAllConversations: () => void;
  getActiveConversation: () => Conversation | null;
  removeLastMessage: (conversationId: string) => void;
  loadFromServer: () => Promise<void>;
}

type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  isLoading: true,
  isHydrated: false,
};

// Debounce pour la sauvegarde
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
const SAVE_DEBOUNCE_MS = 1000;

const debouncedSave = (conversations: Conversation[]) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    storageService.saveConversations(conversations);
  }, SAVE_DEBOUNCE_MS);
};

export const useChatStore = create<ChatStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    loadFromServer: async () => {
      set({ isLoading: true });
      try {
        const conversations = await storageService.loadConversations();
        set({
          conversations,
          activeConversationId: conversations[0]?.id ?? null,
          isLoading: false,
          isHydrated: true,
        });
      } catch (error) {
        console.error('[ChatStore] Erreur chargement:', error);
        set({ isLoading: false, isHydrated: true });
      }
    },

    createConversation: (model, systemPrompt) => {
      const conversation = createConversation(model, systemPrompt);

      set((state) => ({
        conversations: [conversation, ...state.conversations],
        activeConversationId: conversation.id,
      }));

      return conversation.id;
    },

    deleteConversation: (id) => {
      set((state) => {
        const newConversations = state.conversations.filter((c) => c.id !== id);
        const newActiveId =
          state.activeConversationId === id
            ? newConversations[0]?.id ?? null
            : state.activeConversationId;

        return {
          conversations: newConversations,
          activeConversationId: newActiveId,
        };
      });
    },

    setActiveConversation: (id) => {
      set({ activeConversationId: id });
    },

    addMessage: (conversationId, message) => {
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, message],
                updatedAt: new Date(),
              }
            : conv
        ),
      }));
    },

    updateMessage: (conversationId, messageId, content) => {
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: conv.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, content } : msg
                ),
                updatedAt: new Date(),
              }
            : conv
        ),
      }));
    },

    setMessageStreaming: (conversationId, messageId, isStreaming) => {
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: conv.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, isStreaming } : msg
                ),
              }
            : conv
        ),
      }));
    },

    renameConversation: (id, title) => {
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === id ? { ...conv, title, updatedAt: new Date() } : conv
        ),
      }));
    },

    removeLastMessage: (conversationId) => {
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: conv.messages.slice(0, -1),
                updatedAt: new Date(),
              }
            : conv
        ),
      }));
    },

    clearAllConversations: async () => {
      await storageService.clearConversations();
      set(initialState);
      set({ isLoading: false, isHydrated: true });
    },

    getActiveConversation: () => {
      const state = get();
      return (
        state.conversations.find((c) => c.id === state.activeConversationId) ?? null
      );
    },
  }))
);

// Souscrire aux changements pour sauvegarder automatiquement
useChatStore.subscribe(
  (state) => state.conversations,
  (conversations) => {
    const state = useChatStore.getState();
    // Ne pas sauvegarder pendant le chargement initial
    if (state.isHydrated && conversations.length >= 0) {
      debouncedSave(conversations);
    }
  }
);

// Charger les conversations au démarrage
useChatStore.getState().loadFromServer();

// Export du helper pour créer un message
export { createMessage };
