/**
 * Formate une date en format relatif (il y a X minutes, hier, etc.)
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return "À l'instant";
  }
  if (diffMin < 60) {
    return `Il y a ${diffMin} min`;
  }
  if (diffHour < 24) {
    return `Il y a ${diffHour}h`;
  }
  if (diffDay === 1) {
    return 'Hier';
  }
  if (diffDay < 7) {
    return `Il y a ${diffDay} jours`;
  }

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Formate une date en heure (HH:MM)
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formate une taille en bytes en format lisible (Ko, Mo, Go)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'Ko', 'Mo', 'Go', 'To'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Formate une durée en millisecondes en format lisible
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Tronque un texte avec ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Génère un titre à partir du premier message d'une conversation
 */
export function generateTitle(firstMessage: string): string {
  // Nettoie le message
  const cleaned = firstMessage
    .replace(/```[\s\S]*?```/g, '') // Retire les blocs de code
    .replace(/`[^`]+`/g, '') // Retire le code inline
    .replace(/\n+/g, ' ') // Remplace les sauts de ligne
    .trim();

  // Tronque à 50 caractères max
  return truncate(cleaned, 50) || 'Nouvelle conversation';
}
