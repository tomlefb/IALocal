import { Menu, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { useConnectionStore } from '@/stores/connectionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAuthStore } from '@/stores/authStore';
import { IconButton } from '@/components/ui';
import { cn, DEFAULT_MODEL } from '@/utils';

export interface HeaderProps {
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
}

export function Header({ onOpenSettings, onToggleSidebar }: HeaderProps) {
  const activeConversation = useChatStore((state) => state.getActiveConversation());
  const { isConnected } = useConnectionStore();
  const { theme, updateSettings } = useSettingsStore();
  const { logout } = useAuthStore();

  const title = activeConversation?.title || 'Nouvelle conversation';

  // Nom court du modèle pour l'affichage
  const modelDisplayName = DEFAULT_MODEL.split(':')[0];

  // Toggle theme
  const toggleTheme = () => {
    updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header
      className={cn(
        'h-14 flex items-center justify-between px-4 gap-4',
        'bg-bg-secondary/50 backdrop-blur-sm',
        'border-b border-border-subtle'
      )}
    >
      {/* Gauche : Menu burger + Titre */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Bouton burger (mobile only) */}
        <IconButton
          icon={Menu}
          onClick={onToggleSidebar}
          tooltip="Menu"
          className="md:hidden flex-shrink-0"
        />

        {/* Titre de la conversation */}
        <h1 className="text-sm font-medium text-text-primary truncate">
          {title}
        </h1>
      </div>

      {/* Droite : Modèle, Connexion, Theme, Settings */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* Nom du modèle */}
        <div
          className={cn(
            'hidden sm:block px-2 py-1.5 rounded-lg',
            'bg-surface border border-border-subtle',
            'text-sm text-text-secondary',
            'max-w-[140px] md:max-w-[200px]'
          )}
          title={DEFAULT_MODEL}
        >
          <span className="truncate block">{modelDisplayName}</span>
        </div>

        {/* Indicateur de connexion */}
        <div
          className={cn(
            'w-2.5 h-2.5 rounded-full flex-shrink-0',
            'transition-colors duration-300',
            isConnected ? 'bg-success' : 'bg-error'
          )}
          title={isConnected ? 'Connecté à Ollama' : 'Non connecté'}
        />

        {/* Toggle theme */}
        <IconButton
          icon={theme === 'dark' ? Sun : Moon}
          onClick={toggleTheme}
          tooltip={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        />

        {/* Bouton paramètres */}
        <IconButton
          icon={Settings}
          onClick={onOpenSettings}
          tooltip="Paramètres"
        />

        {/* Bouton déconnexion */}
        <IconButton
          icon={LogOut}
          onClick={logout}
          tooltip="Déconnexion"
        />
      </div>
    </header>
  );
}
