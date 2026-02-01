import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Dossier de données
const DATA_DIR = path.join(__dirname, 'data');
const CONVERSATIONS_FILE = path.join(DATA_DIR, 'conversations.json');

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Logging des requêtes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ============ Proxy Ollama (AVANT express.json pour ne pas interférer avec le streaming) ============

app.use('/ollama-api', createProxyMiddleware({
  target: 'http://localhost:11434',
  changeOrigin: true,
  pathRewrite: { '^/ollama-api': '' },
  // Désactiver le buffering pour le streaming
  selfHandleResponse: false,
  proxyTimeout: 0,
  timeout: 0,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] -> ${req.method} ${req.url}`);
    proxyReq.setHeader('Accept-Encoding', 'identity');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[Proxy] <- ${proxyRes.statusCode} ${req.url}`);
    proxyRes.headers['cache-control'] = 'no-cache';
    proxyRes.headers['x-accel-buffering'] = 'no';
  },
  onError: (err, req, res) => {
    console.error('[Proxy Error]', err.message);
    if (!res.headersSent) {
      res.status(502).json({
        error: 'Ollama non accessible',
        message: err.message
      });
    }
  }
}));

// ============ Middleware JSON (après le proxy) ============

app.use(express.json({ limit: '50mb' }));

// ============ API Conversations ============

app.get('/api/conversations', (req, res) => {
  try {
    if (fs.existsSync(CONVERSATIONS_FILE)) {
      const data = fs.readFileSync(CONVERSATIONS_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('[API] Erreur lecture conversations:', error);
    res.status(500).json({ error: 'Erreur lecture des conversations' });
  }
});

app.post('/api/conversations', (req, res) => {
  try {
    const conversations = req.body;
    fs.writeFileSync(CONVERSATIONS_FILE, JSON.stringify(conversations, null, 2));
    res.json({ success: true, count: conversations.length });
  } catch (error) {
    console.error('[API] Erreur sauvegarde conversations:', error);
    res.status(500).json({ error: 'Erreur sauvegarde des conversations' });
  }
});

app.delete('/api/conversations', (req, res) => {
  try {
    if (fs.existsSync(CONVERSATIONS_FILE)) {
      fs.unlinkSync(CONVERSATIONS_FILE);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('[API] Erreur suppression conversations:', error);
    res.status(500).json({ error: 'Erreur suppression des conversations' });
  }
});

// ============ Fichiers statiques ============

app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║               IA Locale - Serveur de production           ║
╠═══════════════════════════════════════════════════════════╣
║  Serveur:  http://0.0.0.0:${PORT}                            ║
║  Proxy:    /ollama-api -> http://localhost:11434          ║
║  Data:     ${DATA_DIR}
╚═══════════════════════════════════════════════════════════╝
  `);
});
