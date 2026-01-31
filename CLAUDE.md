# IA Locale - Instructions pour Claude Code

## Contexte du projet

Application web de chat pour interagir avec une IA locale via Ollama. C'est un cadeau pour un utilisateur qui a besoin d'une IA pour coder au travail mais ne peut pas utiliser ChatGPT/Claude pour des raisons de sécurité. **Tout doit rester 100% local.**

## Stack technique

- **Framework** : React 18 + TypeScript (strict mode)
- **Build** : Vite
- **Styling** : Tailwind CSS
- **State** : Zustand avec persistance localStorage
- **Icônes** : Lucide React
- **Markdown** : react-markdown + rehype-highlight

## Architecture

```
src/
├── components/
│   ├── chat/           # ChatWindow, MessageList, MessageBubble, InputBar, CodeBlock
│   ├── sidebar/        # Sidebar, ConversationList, ConversationItem
│   ├── ui/             # Button, Modal, Dropdown, Toggle, Badge (réutilisables)
│   ├── layout/         # Layout, Header, MobileNav
│   └── settings/       # SettingsModal, ModelSettings
├── services/           # ollama.service.ts (API calls)
├── stores/             # chatStore, settingsStore, connectionStore (Zustand)
├── hooks/              # useChat, useStreamResponse, useOllamaStatus
├── types/              # chat.types, ollama.types, settings.types
└── utils/              # cn, formatters, constants
```

## Conventions de code

- **Composants** : Fonctionnels uniquement, PascalCase, un fichier par composant
- **Hooks** : camelCase, préfixe `use`
- **Types** : Stricts, pas de `any`, fichiers `.types.ts`
- **Imports** : Utiliser l'alias `@/` pour les chemins absolus
- **CSS** : Tailwind uniquement, utiliser les classes du design system définies dans `tailwind.config.js`

## Design System

### Couleurs (définies dans tailwind.config.js)
- Fonds : `bg-primary` (#0a0a0a), `bg-secondary` (#141414), `bg-tertiary` (#1f1f1f)
- Surfaces : `surface`, `surface-hover`, `surface-active`
- Texte : `text-primary` (blanc), `text-secondary` (gris), `text-tertiary` (gris foncé)
- Accent : `accent` (#3b82f6), `accent-hover`
- Bulles : `bubble-user` (bleu), `bubble-assistant` (gris)

### Classes utilitaires (définies dans index.css)
- `.glass` - Effet glassmorphism
- `.card` - Card avec bordure subtile
- `.input`, `.textarea` - Champs de saisie stylés
- `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-icon` - Boutons
- `.badge-success`, `.badge-error`, `.badge-warning` - Badges de statut

## Directives de design

**IMPORTANT** : Lire le fichier `skills/frontend-design-skills.md` avant tout développement UI.

### Esthétique visée
- **Ton** : Interface professionnelle, élégante, dark mode exclusif
- **Typographie** : Fonts distinctives (Inter pour le corps, JetBrains Mono pour le code)
- **Couleurs** : Palette sombre avec accent bleu vif (#3b82f6)
- **Motion** : Animations subtiles mais présentes (fade-in, slide, typing indicator)
- **Atmosphère** : Moderne, technique, rassurante (badge "100% Local" toujours visible)

### Ce qu'on évite
- Emojis dans l'interface (sauf si explicitement demandé)
- Designs génériques "AI chatbot"
- Couleurs fades ou palettes indécises
- Animations excessives ou distrayantes

## API Ollama

Base URL : `http://localhost:11434` (configurable)

### Endpoints principaux
- `GET /` - Health check
- `GET /api/tags` - Liste des modèles installés
- `GET /api/ps` - Modèles en cours d'exécution
- `POST /api/chat` - Chat avec streaming (endpoint principal)

### Streaming
Le chat utilise le streaming via `ReadableStream`. Chaque chunk est un JSON avec :
```typescript
{ model: string, message: { role: 'assistant', content: string }, done: boolean }
```

## Fonctionnalités prioritaires

### MVP (v1.0)
1. Chat avec streaming (effet machine à écrire)
2. Sélection du modèle
3. Rendu Markdown avec syntax highlighting
4. Copier les messages
5. Badge "100% Local" visible

### v1.1
1. Multi-conversations avec sidebar
2. Persistance localStorage
3. Renommer/supprimer conversations

### v1.2
1. Paramètres complets (température, system prompt)
2. Export/Import conversations
3. Raccourcis clavier

## Commandes utiles

```bash
npm run dev      # Lance le serveur de dev (port 3000)
npm run build    # Build de production
npm run preview  # Preview du build
npm run lint     # Lint le code
```

## Notes importantes

- Le proxy Vite redirige `/api` vers Ollama (évite les problèmes CORS)
- Les conversations sont persistées en localStorage
- L'app doit être responsive (mobile-first pour la sidebar)
- Toujours gérer les états d'erreur (Ollama non accessible, modèle non trouvé)
