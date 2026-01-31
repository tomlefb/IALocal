import { create } from 'zustand';
import type { OllamaModel } from '@/types/ollama.types';
import { ollamaService } from '@/services/ollama.service';

interface ConnectionState {
  isConnected: boolean;
  isChecking: boolean;
  availableModels: OllamaModel[];
  runningModels: string[];
  error: string | null;
}

interface ConnectionActions {
  checkConnection: () => Promise<boolean>;
  fetchModels: () => Promise<void>;
  reset: () => void;
}

type ConnectionStore = ConnectionState & ConnectionActions;

const initialState: ConnectionState = {
  isConnected: false,
  isChecking: false,
  availableModels: [],
  runningModels: [],
  error: null,
};

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  ...initialState,

  checkConnection: async () => {
    set({ isChecking: true, error: null });

    try {
      const isConnected = await ollamaService.checkConnection();

      set({ isConnected, isChecking: false });

      // Si connecté, on récupère automatiquement les modèles
      if (isConnected) {
        await get().fetchModels();
      }

      return isConnected;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion inconnue';
      set({
        isConnected: false,
        isChecking: false,
        error: errorMessage,
      });
      return false;
    }
  },

  fetchModels: async () => {
    try {
      const [availableModels, runningModels] = await Promise.all([
        ollamaService.listModels(),
        ollamaService.getRunningModels(),
      ]);

      set({
        availableModels,
        runningModels,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des modèles';
      set({ error: errorMessage });
    }
  },

  reset: () => {
    set(initialState);
  },
}));
