import { useState, useCallback, type FormEvent, type KeyboardEvent } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/utils';

export function LoginScreen() {
  const [password, setPassword] = useState('');
  const { login, error, clearError } = useAuthStore();

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (password.trim()) {
        login(password);
      }
    },
    [password, login]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSubmit(e as unknown as FormEvent);
      }
    },
    [handleSubmit]
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      if (error) {
        clearError();
      }
    },
    [error, clearError]
  );

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
      {/* Card de login */}
      <div
        className={cn(
          'w-full max-w-sm',
          'bg-bg-secondary rounded-2xl',
          'border border-border-subtle',
          'shadow-2xl shadow-black/20',
          'p-8'
        )}
      >
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div
            className={cn(
              'inline-flex items-center justify-center',
              'w-16 h-16 rounded-2xl mb-4',
              'bg-gradient-to-br from-accent to-accent/70',
              'shadow-lg shadow-accent/25'
            )}
          >
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">IA Locale</h1>
          <p className="text-sm text-text-secondary">
            Entrez le mot de passe pour accéder
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input mot de passe */}
          <div className="space-y-2">
            <label htmlFor="password" className="sr-only">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={handleKeyDown}
              placeholder="Mot de passe"
              autoFocus
              autoComplete="current-password"
              className={cn(
                'w-full px-4 py-3 rounded-xl',
                'bg-bg-tertiary border',
                error ? 'border-error' : 'border-border-subtle',
                'text-text-primary placeholder:text-text-tertiary',
                'focus:outline-none focus:ring-2',
                error ? 'focus:ring-error/50' : 'focus:ring-accent/50',
                'focus:border-transparent',
                'transition-all duration-200'
              )}
            />
          </div>

          {/* Message d'erreur */}
          {error && (
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg',
                'bg-error/10 border border-error/30',
                'text-error text-sm'
              )}
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={!password.trim()}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'bg-accent hover:bg-accent-hover',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'text-white font-medium',
              'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-secondary',
              'transition-all duration-200'
            )}
          >
            Accéder
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-text-tertiary">
        T'inquiète, ici tout est en local !
      </p>
    </div>
  );
}
