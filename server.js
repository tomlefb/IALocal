import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Proxy pour Ollama - redirige /ollama-api/* vers http://localhost:11434/*
app.use('/ollama-api', createProxyMiddleware({
  target: 'http://localhost:11434',
  changeOrigin: true,
  pathRewrite: { '^/ollama-api': '' },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(502).json({
      error: 'Ollama non accessible',
      message: 'Vérifiez que Ollama est bien lancé sur localhost:11434'
    });
  }
}));

// Servir les fichiers statiques du build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - toutes les autres routes renvoient index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║               IA Locale - Serveur de production           ║
╠═══════════════════════════════════════════════════════════╣
║  Serveur:  http://localhost:${PORT}                          ║
║  Proxy:    /ollama-api -> http://localhost:11434          ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
