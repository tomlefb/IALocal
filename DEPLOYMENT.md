# Déploiement IA Locale via Tailscale Funnel

Ce guide explique comment déployer l'application pour un accès distant sécurisé via Tailscale.

## Architecture

```
[PC distant] --> [Tailscale Funnel] --> [Express:3000] --> [Ollama:11434]
                 (HTTPS public)         (proxy local)      (IA locale)
```

## Prérequis

- Node.js 18+
- Ollama installé et fonctionnel
- Tailscale installé et connecté

## 1. Configuration d'Ollama

Ollama doit accepter les connexions depuis le proxy Express.

### Windows (PowerShell admin)

```powershell
# Définir les variables d'environnement système
[System.Environment]::SetEnvironmentVariable("OLLAMA_HOST", "0.0.0.0:11434", "User")
[System.Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")

# Redémarrer Ollama
Stop-Process -Name "ollama" -Force -ErrorAction SilentlyContinue
ollama serve
```

### Linux/macOS

```bash
# Ajouter au ~/.bashrc ou ~/.zshrc
export OLLAMA_HOST=0.0.0.0:11434
export OLLAMA_ORIGINS=*

# Redémarrer Ollama
pkill ollama
ollama serve
```

### Vérifier qu'Ollama fonctionne

```bash
curl http://localhost:11434
# Doit retourner: "Ollama is running"
```

## 2. Build et lancement de l'application

```bash
# Installer les dépendances
npm install

# Build et lancement en une commande
npm run prod
```

L'application sera accessible sur `http://localhost:3000`.

## 3. Configuration de Tailscale Funnel

Tailscale Funnel expose un port local sur Internet via HTTPS.

```bash
# Activer Funnel pour le port 3000
tailscale funnel 3000
```

Cela affiche l'URL publique, par exemple :
```
https://desktop-sc8nhkq.tailb47873.ts.net/
```

### Pour un accès permanent

```bash
# Lancer en arrière-plan
tailscale funnel --bg 3000
```

### Vérifier le statut

```bash
tailscale funnel status
```

## 4. URL à partager

Partagez cette URL avec l'utilisateur distant :

```
https://desktop-sc8nhkq.tailb47873.ts.net/
```

L'utilisateur peut accéder à l'application directement dans son navigateur, sans installation.

## 5. Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Développement (Vite + proxy) |
| `npm run build` | Build de production |
| `npm start` | Lance le serveur Express |
| `npm run prod` | Build + lancement |

## Dépannage

### "Ollama non accessible"

1. Vérifier qu'Ollama tourne : `curl http://localhost:11434`
2. Vérifier OLLAMA_HOST : `echo $OLLAMA_HOST` (doit être `0.0.0.0:11434`)
3. Redémarrer Ollama après changement de config

### "Funnel not available"

1. Vérifier que Tailscale est connecté : `tailscale status`
2. Funnel nécessite un compte Tailscale (gratuit)
3. Peut nécessiter d'activer Funnel dans la console admin Tailscale

### L'application ne charge pas

1. Vérifier le build : `ls dist/` doit contenir `index.html`
2. Vérifier les logs du serveur Express
3. Essayer `npm run build` à nouveau

## Sécurité

- Tailscale Funnel utilise HTTPS automatiquement
- L'accès est public (pas d'authentification Tailscale requise)
- Ollama reste accessible uniquement en local (via le proxy)
- Aucune donnée ne transite par des serveurs tiers (100% local)
