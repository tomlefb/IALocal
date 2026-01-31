import { useState } from 'react';
import { Download, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { useSettingsStore } from '@/stores/settingsStore';
import { useConnectionStore } from '@/stores/connectionStore';
import { useChatStore } from '@/stores/chatStore';
import { cn, STORAGE_KEYS } from '@/utils';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ConnectionTestStatus = 'idle' | 'testing' | 'success' | 'error';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [connectionTestStatus, setConnectionTestStatus] = useState<ConnectionTestStatus>('idle');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Stores
  const {
    ollamaUrl,
    systemPrompt,
    userName,
    updateSettings,
  } = useSettingsStore();

  const { checkConnection } = useConnectionStore();
  const { conversations, clearAllConversations } = useChatStore();

  // Test de connexion
  const handleTestConnection = async () => {
    setConnectionTestStatus('testing');
    try {
      const success = await checkConnection();
      setConnectionTestStatus(success ? 'success' : 'error');
    } catch {
      setConnectionTestStatus('error');
    }

    // Reset du statut après 3 secondes
    setTimeout(() => setConnectionTestStatus('idle'), 3000);
  };

  // Export des conversations
  const handleExportConversations = () => {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (!data) return;

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ia-locale-conversations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Suppression de toutes les conversations
  const handleDeleteAll = () => {
    clearAllConversations();
    setShowDeleteConfirm(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Paramètres" size="md">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1 -mx-1">
        {/* Section Connexion */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Connexion
          </h3>

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">URL Ollama</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => updateSettings({ ollamaUrl: e.target.value })}
                className="input flex-1 min-w-0"
                placeholder="http://localhost:11434"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleTestConnection}
                disabled={connectionTestStatus === 'testing'}
                className="flex-shrink-0 px-3"
              >
                {connectionTestStatus === 'testing' && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {connectionTestStatus === 'success' && (
                  <CheckCircle className="h-4 w-4 text-success" />
                )}
                {connectionTestStatus === 'error' && (
                  <XCircle className="h-4 w-4 text-error" />
                )}
                {connectionTestStatus === 'idle' && 'Test'}
                {connectionTestStatus === 'testing' && '...'}
                {connectionTestStatus === 'success' && 'OK'}
                {connectionTestStatus === 'error' && 'Err'}
              </Button>
            </div>
          </div>
        </section>

        {/* Section Modèle */}
        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Modèle
          </h3>

          {/* System Prompt */}
          <div className="space-y-2">
            <label className="text-sm text-text-secondary">System prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
              rows={4}
              className="textarea w-full resize-none"
              placeholder="Instructions pour le modèle..."
            />
          </div>
        </section>

        {/* Section Interface */}
        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Interface
          </h3>

          {/* Nom d'utilisateur */}
          <div className="space-y-2">
            <label className="text-sm text-text-secondary">Nom d'utilisateur</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => updateSettings({ userName: e.target.value })}
              className="input w-full"
              placeholder="Utilisateur"
            />
          </div>

        </section>

        {/* Section Données */}
        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Données
          </h3>

          <div className="flex flex-col gap-3">
            {/* Export */}
            <button
              onClick={handleExportConversations}
              disabled={conversations.length === 0}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg',
                'bg-surface hover:bg-surface-hover',
                'border border-border-subtle',
                'text-sm text-text-primary',
                'transition-colors duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <Download className="h-4 w-4" />
              Exporter les conversations ({conversations.length})
            </button>

            {/* Suppression */}
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={conversations.length === 0}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg',
                  'bg-error/10 hover:bg-error/20',
                  'border border-error/30',
                  'text-sm text-error',
                  'transition-colors duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <Trash2 className="h-4 w-4" />
                Supprimer toutes les conversations
              </button>
            ) : (
              <div className="p-3 rounded-lg bg-error/10 border border-error/30 space-y-3">
                <p className="text-sm text-error font-medium">
                  Supprimer {conversations.length} conversation{conversations.length > 1 ? 's' : ''} ?
                </p>
                <p className="text-xs text-text-secondary">
                  Cette action est irréversible.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <button
                    onClick={handleDeleteAll}
                    className={cn(
                      'flex-1 px-3 py-1.5 rounded-lg text-sm',
                      'bg-error hover:bg-error/80 text-white',
                      'transition-colors duration-200'
                    )}
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border-subtle">
        <Button variant="primary" onClick={onClose} className="w-full">
          Fermer
        </Button>
      </div>
    </Modal>
  );
}
