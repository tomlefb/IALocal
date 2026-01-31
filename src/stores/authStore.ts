import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'dev123';

interface AuthState {
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthActions {
  login: (password: string) => boolean;
  logout: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      error: null,

      login: (password: string) => {
        if (password === APP_PASSWORD) {
          set({ isAuthenticated: true, error: null });
          return true;
        }
        set({ error: 'Mot de passe incorrect' });
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, error: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'ia-locale-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
