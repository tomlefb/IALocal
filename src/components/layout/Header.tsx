import { Menu, Settings, Check, ChevronDown, Shield } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { useConnectionStore } from '@/stores/connectionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { IconButton, Badge, Dropdown } from '@/components/ui';
import type { DropdownItem } from '@/components/ui';
import { cn } from '@/utils';

export interface HeaderProps {
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
}

export function Header({ onOpenSettings, onToggleSidebar }: HeaderProps) {
  const activeConversation = useChatStore((state) => state.getActiveConversation());
  const { isConnected, availableModels } = useConnectionStore();
  const { defaultModel, updateSettings } = useSettingsStore();

  const title = activeConversation?.title || 'Nouvelle conversation';

  // Dropdown items pour les modèles
  const modelItems: DropdownItem[] = availableModels.map((model) => ({
    label: model.name,
    onClick: () => updateSettings({ defaultModel: model.name }),
    icon: model.name === defaultModel ? Check : undefined,
  }));

  // Si aucun modèle disponible
  if (modelItems.length === 0) {
    modelItems.push({
      label: 'Aucun modèle',
      onClick: () => {},
      disabled: true,
    });
  }

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

      {/* Droite : Modèle, Badge, Connexion, Settings */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* Sélecteur de modèle */}
        <Dropdown
          trigger={
            <div
              className={cn(
                'flex items-center gap-1.5 px-2 py-1.5 rounded-lg',
                'bg-surface hover:bg-surface-hover',
                'border border-border-subtle',
                'text-sm text-text-secondary hover:text-text-primary',
                'transition-colors duration-200',
                'max-w-[120px] md:max-w-[180px]'
              )}
            >
              <span className="truncate">
                {defaultModel || 'Modèle'}
              </span>
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            </div>
          }
          items={modelItems}
          align="right"
        />

        {/* Badge 100% Local */}
        <Badge variant="success" icon={Shield} className="hidden sm:inline-flex">
          100% Local
        </Badge>

        {/* Indicateur de connexion */}
        <div
          className={cn(
            'w-2.5 h-2.5 rounded-full flex-shrink-0',
            'transition-colors duration-300',
            isConnected ? 'bg-success' : 'bg-error'
          )}
          title={isConnected ? 'Connecté à Ollama' : 'Non connecté'}
        />

        {/* Bouton paramètres */}
        <IconButton
          icon={Settings}
          onClick={onOpenSettings}
          tooltip="Paramètres"
        />
      </div>
    </header>
  );
}
