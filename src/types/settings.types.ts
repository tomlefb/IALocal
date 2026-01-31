export type Theme = 'light' | 'dark' | 'system';

export interface Settings {
  // Connexion
  ollamaUrl: string;
  
  // Modèle
  defaultModel: string;
  temperature: number;
  systemPrompt: string;
  
  // Interface
  theme: Theme;
  userName: string;
  sendOnEnter: boolean;
  showTokenCount: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export const DEFAULT_SETTINGS: Settings = {
  ollamaUrl: 'http://localhost:11434',
  defaultModel: 'qwen2.5-coder:14b-instruct-q4_K_M',
  temperature: 0.7,
  systemPrompt: 'Tu es un assistant de programmation expert. Tu réponds de manière concise et précise en français.',
  theme: 'dark',
  userName: 'Utilisateur',
  sendOnEnter: false, // Ctrl+Enter par défaut
  showTokenCount: false,
  fontSize: 'medium',
};
