// === API ===
export const DEFAULT_OLLAMA_URL = 'http://localhost:11434';

// === UI ===
export const SIDEBAR_WIDTH = 280;
export const HEADER_HEIGHT = 56;
export const INPUT_MAX_HEIGHT = 200;

// === STORAGE KEYS ===
export const STORAGE_KEYS = {
  CONVERSATIONS: 'ia-locale-conversations',
  SETTINGS: 'ia-locale-settings',
  ACTIVE_CONVERSATION: 'ia-locale-active-conversation',
} as const;

// === KEYBOARD SHORTCUTS ===
export const SHORTCUTS = {
  SEND_MESSAGE: 'Ctrl+Enter',
  NEW_CONVERSATION: 'Ctrl+N',
  OPEN_SETTINGS: 'Ctrl+Shift+S',
  STOP_GENERATION: 'Escape',
  COPY_LAST_RESPONSE: 'Ctrl+Shift+C',
} as const;

// === LIMITS ===
export const LIMITS = {
  MAX_MESSAGE_LENGTH: 10000,
  MAX_TITLE_LENGTH: 100,
  MAX_CONVERSATIONS: 100,
  DEBOUNCE_SEARCH_MS: 300,
} as const;

// === SUGGESTIONS DE PROMPTS ===
export const PROMPT_SUGGESTIONS = [
  "Explique-moi les design patterns",
  "Debug ce code pour moi",
  "Ecris une fonction qui...",
  "Quelle est la différence entre...",
  "Comment optimiser ce code ?",
  "Explique ce concept simplement",
] as const;
