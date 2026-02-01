import type { Conversation } from '@/types/chat.types';

const STORAGE_KEY = 'ia-locale-conversations';
const API_BASE = '/api/conversations';

/**
 * Service de stockage des conversations
 * Utilise le serveur en priorité, avec fallback sur localStorage
 */
class StorageService {
  private useLocalStorage = false;

  /**
   * Charge les conversations depuis le serveur
   */
  async loadConversations(): Promise<Conversation[]> {
    try {
      const response = await fetch(API_BASE, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const conversations = await response.json();
      this.useLocalStorage = false;

      // Convertir les dates string en Date
      return this.hydrateConversations(conversations);
    } catch (error) {
      console.warn('[Storage] Serveur inaccessible, fallback localStorage:', error);
      this.useLocalStorage = true;
      return this.loadFromLocalStorage();
    }
  }

  /**
   * Sauvegarde les conversations sur le serveur
   */
  async saveConversations(conversations: Conversation[]): Promise<boolean> {
    // Toujours sauvegarder en localStorage comme backup
    this.saveToLocalStorage(conversations);

    if (this.useLocalStorage) {
      return true;
    }

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conversations),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return true;
    } catch (error) {
      console.warn('[Storage] Erreur sauvegarde serveur:', error);
      this.useLocalStorage = true;
      return false;
    }
  }

  /**
   * Supprime toutes les conversations
   */
  async clearConversations(): Promise<boolean> {
    // Vider le localStorage
    localStorage.removeItem(STORAGE_KEY);

    if (this.useLocalStorage) {
      return true;
    }

    try {
      const response = await fetch(API_BASE, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.warn('[Storage] Erreur suppression serveur:', error);
      return false;
    }
  }

  /**
   * Charge depuis localStorage (fallback)
   */
  private loadFromLocalStorage(): Conversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return this.hydrateConversations(parsed.state?.conversations || []);
      }
    } catch (error) {
      console.error('[Storage] Erreur lecture localStorage:', error);
    }
    return [];
  }

  /**
   * Sauvegarde dans localStorage (backup)
   */
  private saveToLocalStorage(conversations: Conversation[]): void {
    try {
      const data = {
        state: { conversations },
        version: 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('[Storage] Erreur sauvegarde localStorage:', error);
    }
  }

  /**
   * Convertit les dates string en objets Date
   */
  private hydrateConversations(conversations: Conversation[]): Conversation[] {
    return conversations.map((conv) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        isStreaming: false,
      })),
    }));
  }
}

export const storageService = new StorageService();
