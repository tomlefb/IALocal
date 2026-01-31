import type {
  OllamaModel,
  OllamaModelsResponse,
  OllamaRunningModelsResponse,
  OllamaChatRequest,
  OllamaChatResponse,
  OllamaChatMessage,
  OllamaChatOptions,
} from '@/types/ollama.types';

const DEFAULT_BASE_URL = 'http://localhost:11434';

class OllamaService {
  private baseUrl: string;

  constructor(baseUrl: string = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Vérifie si Ollama est accessible
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Récupère la liste des modèles installés
   */
  async listModels(): Promise<OllamaModel[]> {
    const response = await fetch(`${this.baseUrl}/api/tags`);

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des modèles: ${response.statusText}`);
    }

    const data: OllamaModelsResponse = await response.json();
    return data.models;
  }

  /**
   * Récupère les modèles actuellement chargés en mémoire
   */
  async getRunningModels(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/ps`);

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des modèles en cours: ${response.statusText}`);
    }

    const data: OllamaRunningModelsResponse = await response.json();
    return data.models.map((m) => m.name);
  }

  /**
   * Envoie un message et retourne un AsyncGenerator pour le streaming
   */
  async *streamChat(
    model: string,
    messages: OllamaChatMessage[],
    options?: OllamaChatOptions,
    abortSignal?: AbortSignal
  ): AsyncGenerator<string, void, unknown> {
    const request: OllamaChatRequest = {
      model,
      messages,
      stream: true,
      options,
    };

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: abortSignal,
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du chat: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Pas de body dans la réponse');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((line) => line.trim());

        for (const line of lines) {
          try {
            const parsed: OllamaChatResponse = JSON.parse(line);

            if (parsed.message?.content) {
              yield parsed.message.content;
            }

            if (parsed.done) {
              return;
            }
          } catch {
            // Ignorer les lignes mal formées (chunks partiels)
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Envoie un message sans streaming (utile pour les tests)
   */
  async chat(
    model: string,
    messages: OllamaChatMessage[],
    options?: OllamaChatOptions
  ): Promise<OllamaChatResponse> {
    const request: OllamaChatRequest = {
      model,
      messages,
      stream: false,
      options,
    };

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du chat: ${response.statusText}`);
    }

    return response.json();
  }
}

// Instance singleton exportée
export const ollamaService = new OllamaService();

// Export de la classe pour les tests ou instanciations personnalisées
export { OllamaService };
