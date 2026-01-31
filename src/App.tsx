function App() {
  return (
    <div className="flex h-screen bg-bg-primary">
      {/* Sidebar - à développer */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border-subtle bg-bg-secondary">
        <div className="p-4 border-b border-border-subtle">
          <h1 className="text-lg font-semibold text-text-primary">IA Locale</h1>
        </div>
        <div className="flex-1 p-4">
          <p className="text-text-tertiary text-sm">Conversations...</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header - à développer */}
        <header className="h-14 border-b border-border-subtle bg-bg-secondary/50 backdrop-blur-sm flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="text-text-primary font-medium">Nouvelle conversation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-success">100% Local</span>
          </div>
        </header>

        {/* Chat area - à développer */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <h2 className="text-2xl font-semibold text-text-primary mb-2">
                Bienvenue dans IA Locale
              </h2>
              <p className="text-text-secondary mb-8">
                Commencez une conversation avec votre IA locale
              </p>
              <div className="grid gap-3 w-full max-w-md">
                <button className="card hover:bg-surface-hover text-left transition-colors">
                  <p className="text-text-primary">Explique-moi les design patterns</p>
                </button>
                <button className="card hover:bg-surface-hover text-left transition-colors">
                  <p className="text-text-primary">Debug ce code pour moi</p>
                </button>
                <button className="card hover:bg-surface-hover text-left transition-colors">
                  <p className="text-text-primary">Ecris une fonction qui...</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Input area - à développer */}
        <div className="border-t border-border-subtle bg-bg-secondary/50 backdrop-blur-sm p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <textarea
                className="textarea flex-1"
                placeholder="Ecris ton message..."
                rows={1}
              />
              <button className="btn-primary">
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
