import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Logging des requêtes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Proxy pour Ollama - redirige /ollama-api/* vers http://localhost:11434/*
app.use('/ollama-api', createProxyMiddleware({
  target: 'http://localhost:11434',
  changeOrigin: true,
  pathRewrite: { '^/ollama-api': '' },
  // Important pour le streaming
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] -> ${req.method} ${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[Proxy] <- ${proxyRes.statusCode} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('[Proxy Error]', err.message);
    console.error('[Proxy Error Stack]', err.stack);
    if (!res.headersSent) {
      res.status(502).json({
        error: 'Ollama non accessible',
        message: err.message
      });
    }
  }
}));

// Servir les fichiers statiques du build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - toutes les autres routes renvoient index.html
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
╚═══════════════════════════════════════════════════════════╝
  `);
});
