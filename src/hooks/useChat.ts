import { useCallback, useRef, useState } from 'react';
import { useChatStore, createMessage } from '@/stores/chatStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { ollamaService } from '@/services/ollama.service';
import type { OllamaChatMessage } from '@/types/ollama.types';

/**
 * Génère un titre court basé sur le premier message de l'utilisateur
 */
function generateTitle(content: string): string {
  // Prendre les 50 premiers caractères, couper au dernier mot complet
  const maxLength = 50;
  if (content.length <= maxLength) {
    return content;
  }

  const truncated = content.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 20) {
    return truncated.slice(0, lastSpace) + '...';
  }

  return truncated + '...';
}

export function useChat() {
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Store selectors
  const {
    activeConversationId,
    createConversation,
    addMessage,
    updateMessage,
    setMessageStreaming,
    renameConversation,
    removeLastMessage,
    getActiveConversation,
  } = useChatStore();

  const { defaultModel, temperature, systemPrompt } = useSettingsStore();

  /**
   * Envoie un message et stream la réponse
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isGenerating) return;

      // 1. Créer une conversation si aucune n'est active
      let conversationId = activeConversationId;
      let isNewConversation = false;

      if (!conversationId) {
        conversationId = createConversation(defaultModel, systemPrompt);
        isNewConversation = true;
      }

      // 2. Ajouter le message utilisateur
      const userMessage = createMessage('user', content.trim());
      addMessage(conversationId, userMessage);

      // 3. Créer le message assistant vide en streaming
      const assistantMessage = createMessage('assistant', '', true);
      addMessage(conversationId, assistantMessage);

      // 4. Préparer l'appel à Ollama
      setIsGenerating(true);
      abortControllerRef.current = new AbortController();

      try {
        // Récupérer la conversation avec les messages
        const conversation = getActiveConversation();
        if (!conversation) {
          throw new Error('Conversation introuvable');
        }

        // Construire l'historique des messages pour Ollama
        const ollamaMessages: OllamaChatMessage[] = [];

        // Ajouter le system prompt si présent
        if (conversation.systemPrompt) {
          ollamaMessages.push({
            role: 'system',
            content: conversation.systemPrompt,
          });
        }

        // Ajouter tous les messages sauf le dernier (assistant vide)
        for (const msg of conversation.messages) {
          if (msg.id !== assistantMessage.id && msg.role !== 'system') {
            ollamaMessages.push({
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
            });
          }
        }

        // 5. Stream la réponse
        let fullContent = '';

        const stream = ollamaService.streamChat(
          conversation.model,
          ollamaMessages,
          { temperature },
          abortControllerRef.current.signal
        );

        for await (const chunk of stream) {
          fullContent += chunk;
          updateMessage(conversationId, assistantMessage.id, fullContent);
        }

        // 6. Fin du streaming
        setMessageStreaming(conversationId, assistantMessage.id, false);

        // 7. Générer le titre si nouvelle conversation
        if (isNewConversation) {
          const title = generateTitle(content.trim());
          renameConversation(conversationId, title);
        }
      } catch (error) {
        // Gérer l'annulation
        if (error instanceof Error && error.name === 'AbortError') {
          setMessageStreaming(conversationId, assistantMessage.id, false);
          return;
        }

        // Afficher l'erreur dans le message assistant
        const errorMessage =
          error instanceof Error ? error.message : 'Une erreur est survenue';
        updateMessage(
          conversationId,
          assistantMessage.id,
          `**Erreur :** ${errorMessage}`
        );
        setMessageStreaming(conversationId, assistantMessage.id, false);
      } finally {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    [
      activeConversationId,
      isGenerating,
      createConversation,
      addMessage,
      updateMessage,
      setMessageStreaming,
      renameConversation,
      getActiveConversation,
      defaultModel,
      systemPrompt,
      temperature,
    ]
  );

  /**
   * Arrête la génération en cours
   */
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  /**
   * Régénère la dernière réponse
   */
  const regenerateLastResponse = useCallback(async () => {
    if (isGenerating) return;

    const conversation = getActiveConversation();
    if (!conversation || conversation.messages.length < 2) return;

    // Trouver le dernier message utilisateur
    const messages = conversation.messages;
    const lastAssistantIndex = messages.length - 1;
    const lastUserIndex = messages.length - 2;

    if (
      messages[lastAssistantIndex]?.role !== 'assistant' ||
      messages[lastUserIndex]?.role !== 'user'
    ) {
      return;
    }

    const lastUserContent = messages[lastUserIndex].content;

    // Supprimer le dernier message assistant
    removeLastMessage(conversation.id);

    // Supprimer le dernier message utilisateur (sera recréé par sendMessage)
    removeLastMessage(conversation.id);

    // Renvoyer le message
    await sendMessage(lastUserContent);
  }, [isGenerating, getActiveConversation, removeLastMessage, sendMessage]);

  return {
    sendMessage,
    stopGeneration,
    regenerateLastResponse,
    isGenerating,
  };
}
