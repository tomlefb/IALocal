/**
 * Utility pour combiner des classes conditionnellement
 * Simplifié sans tailwind-merge pour moins de dépendances
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
