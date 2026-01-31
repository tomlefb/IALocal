import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Server } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { SettingsModal } from '@/components/settings';
import { WelcomeScreen } from '@/components/chat/WelcomeScreen';
import { MessageList } from '@/components/chat/MessageList';
import { InputBar } from '@/components/chat/InputBar';
import { useChat } from '@/hooks/useChat';
import { useChatStore } from '@/stores/chatStore';
import { useConnectionStore } from '@/stores/connectionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { cn } from '@/utils';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sidebarKey, setSidebarKey] = useState(0);

  // Stores
  const { setActiveConversation, getActiveConversation } = useChatStore();
  const { isConnected, isChecking, error, checkConnection } = useConnectionStore();
  const { userName, ollamaUrl } = useSettingsStore();

  // Hook de chat
  const { sendMessage, stopGeneration, regenerateLastResponse, isGenerating } = useChat();

  // Conversation active
  const activeConversation = getActiveConversation();
  const messages = activeConversation?.messages ?? [];

  // Vérifie la connexion Ollama au montage
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Handlers
  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarKey((prev) => prev + 1);
  };

  const handleNewChat = () => {
    setActiveConversation(null);
  };

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleRegenerate = () => {
    regenerateLastResponse();
  };

  const handleRetryConnection = () => {
    checkConnection();
  };

  // Rendu de la zone principale
  const renderMainContent = () => {
    // État de vérification de connexion
    if (isChecking) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
          <p className="mt-4 text-text-secondary">Connexion à Ollama...</p>
        </div>
      );
    }

    // Erreur de connexion
    if (!isConnected) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div
              className={cn(
                'p-6 rounded-xl',
                'bg-error/10 border border-error/30',
                'text-center space-y-4'
              )}
            >
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-error/20">
                  <AlertTriangle className="h-8 w-8 text-error" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-text-primary">
                  Impossible de se connecter à Ollama
                </h2>
                <p className="text-sm text-text-secondary">
                  {error || "Vérifiez qu'Ollama est bien lancé sur votre machine."}
                </p>
              </div>

              <div className="pt-2 space-y-3">
                <div className="text-left p-4 rounded-lg bg-bg-tertiary/50 text-sm space-y-2">
                  <p className="text-text-secondary font-medium">Vérifiez que :</p>
                  <ul className="list-disc list-inside text-text-tertiary space-y-1">
                    <li>Ollama est installé et lancé</li>
                    <li>
                      L'URL est correcte :{' '}
                      <code className="text-accent font-mono text-xs">{ollamaUrl}</code>
                    </li>
                    <li>Aucun pare-feu ne bloque la connexion</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleRetryConnection}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2',
                      'px-4 py-2.5 rounded-lg',
                      'bg-accent hover:bg-accent-hover text-white',
                      'transition-colors duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary'
                    )}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Réessayer
                  </button>
                  <button
                    onClick={handleOpenSettings}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2',
                      'px-4 py-2.5 rounded-lg',
                      'bg-surface hover:bg-surface-hover',
                      'border border-border-subtle',
                      'text-text-primary',
                      'transition-colors duration-200'
                    )}
                  >
                    <Server className="h-4 w-4" />
                    Paramètres
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Pas de messages : afficher l'écran de bienvenue
    if (messages.length === 0) {
      return (
        <WelcomeScreen
          userName={userName || undefined}
          onSuggestionClick={handleSuggestionClick}
        />
      );
    }

    // Messages existants : afficher la liste
    return (
      <MessageList
        messages={messages}
        onCopy={handleCopy}
        onRegenerate={handleRegenerate}
        isGenerating={isGenerating}
      />
    );
  };

  return (
    <>
      <Layout
        sidebar={
          <Sidebar
            key={sidebarKey}
            onClose={handleCloseSidebar}
            onNewChat={handleNewChat}
          />
        }
        onOpenSettings={handleOpenSettings}
      >
        {/* Zone de contenu principale */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderMainContent()}

          {/* Input bar - toujours visible si connecté */}
          {isConnected && (
            <InputBar
              onSend={sendMessage}
              onStop={stopGeneration}
              isGenerating={isGenerating}
              disabled={!isConnected}
            />
          )}
        </div>
      </Layout>

      {/* Modal Settings */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}

export default App;
