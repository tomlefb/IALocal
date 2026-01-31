import { Code, Bug, Lightbulb, HelpCircle, Zap, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils';
import { PROMPT_SUGGESTIONS } from '@/utils/constants';

export interface WelcomeScreenProps {
  userName?: string;
  onSuggestionClick: (prompt: string) => void;
}

// Mapping des icônes pour chaque suggestion
const suggestionIcons: LucideIcon[] = [
  BookOpen,    // Explique-moi les design patterns
  Bug,         // Debug ce code pour moi
  Code,        // Ecris une fonction qui...
  HelpCircle,  // Quelle est la différence entre...
  Zap,         // Comment optimiser ce code ?
  Lightbulb,   // Explique ce concept simplement
];

export function WelcomeScreen({
  userName = 'toi',
  onSuggestionClick,
}: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Message de bienvenue */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-text-primary">
            Salut {userName} !
          </h1>
          <p className="text-lg text-text-secondary">
            Comment je peux t'aider ?
          </p>
        </div>

        {/* Grille de suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PROMPT_SUGGESTIONS.map((suggestion, index) => {
            const Icon = suggestionIcons[index] || Lightbulb;
            return (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className={cn(
                  'group flex items-center gap-3 p-4 rounded-xl text-left',
                  'bg-surface border border-border-subtle',
                  'hover:bg-surface-hover hover:border-border-default',
                  'transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary'
                )}
              >
                <div
                  className={cn(
                    'flex-shrink-0 p-2 rounded-lg',
                    'bg-bg-tertiary group-hover:bg-accent/10',
                    'transition-colors duration-200'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 text-text-tertiary',
                      'group-hover:text-accent',
                      'transition-colors duration-200'
                    )}
                  />
                </div>
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-200">
                  {suggestion}
                </span>
              </button>
            );
          })}
        </div>

        {/* Note 100% local */}
        <p className="text-xs text-text-tertiary">
          100% local — Tes conversations restent sur ta machine
        </p>
      </div>
    </div>
  );
}
