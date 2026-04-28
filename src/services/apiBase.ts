const DEFAULT_BASE = '';

export function getApiBase(): string {
  const fromEnv = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  const base = (fromEnv ?? DEFAULT_BASE).trim();
  return base.replace(/\/+$/, '');
}

export function apiUrl(path: string): string {
  const base = getApiBase();
  if (!base) return path;
  if (!path.startsWith('/')) return `${base}/${path}`;
  return `${base}${path}`;
}

