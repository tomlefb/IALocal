// === MODÈLES ===

export interface OllamaModelDetails {
  format: string;
  family: string;
  parameter_size: string;
  quantization_level: string;
}

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: OllamaModelDetails;
}

export interface OllamaModelsResponse {
  models: OllamaModel[];
}

// === RUNNING MODELS ===

export interface OllamaRunningModel {
  name: string;
  size: number;
  digest: string;
  expires_at: string;
}

export interface OllamaRunningModelsResponse {
  models: OllamaRunningModel[];
}

// === CHAT ===

export interface OllamaChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OllamaChatOptions {
  temperature?: number;
  top_p?: number;
  num_ctx?: number;
  seed?: number;
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  stream?: boolean;
  options?: OllamaChatOptions;
}

export interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: {
    role: 'assistant';
    content: string;
  };
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

// === GENERATE (simple completion) ===

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: OllamaChatOptions;
  system?: string;
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}
