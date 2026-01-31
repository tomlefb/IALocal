import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '@/types/settings.types';
import { DEFAULT_SETTINGS } from '@/types/settings.types';
import { ollamaService } from '@/services/ollama.service';

interface SettingsActions {
  updateSettings: (partial: Partial<Settings>) => void;
  resetSettings: () => void;
}

type SettingsStore = Settings & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      updateSettings: (partial) => {
        set((state) => {
          const newSettings = { ...state, ...partial };

          // Mettre à jour l'URL du service Ollama si elle change
          if (partial.ollamaUrl && partial.ollamaUrl !== state.ollamaUrl) {
            ollamaService.setBaseUrl(partial.ollamaUrl);
          }

          return newSettings;
        });
      },

      resetSettings: () => {
        ollamaService.setBaseUrl(DEFAULT_SETTINGS.ollamaUrl);
        set(DEFAULT_SETTINGS);
      },
    }),
    {
      name: 'ia-locale-settings',
      // Ne pas persister les fonctions
      partialize: (state) => ({
        ollamaUrl: state.ollamaUrl,
        defaultModel: state.defaultModel,
        temperature: state.temperature,
        systemPrompt: state.systemPrompt,
        theme: state.theme,
        userName: state.userName,
        sendOnEnter: state.sendOnEnter,
        showTokenCount: state.showTokenCount,
        fontSize: state.fontSize,
      }),
      // Synchroniser l'URL Ollama au chargement
      onRehydrateStorage: () => (state) => {
        if (state?.ollamaUrl) {
          ollamaService.setBaseUrl(state.ollamaUrl);
        }
      },
    }
  )
);
