export type RecentSearchItem = {
  id: string;
  label: string;
  href: string;
  typeLabel: string;
  query: string;
  timestamp: number;
};

const STORAGE_KEY = 'kleverscan:spotlight-recent';
const MAX_ITEMS = 8;

const canUseStorage = (): boolean =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const loadRecentSearches = (): RecentSearchItem[] => {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentSearchItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
};

export const saveRecentSearch = (
  item: Omit<RecentSearchItem, 'id' | 'timestamp'>,
): RecentSearchItem[] => {
  if (!canUseStorage()) return [];

  const next: RecentSearchItem = {
    ...item,
    id: `${item.href}:${Date.now()}`,
    timestamp: Date.now(),
  };

  const previous = loadRecentSearches().filter(
    existing => existing.href !== item.href,
  );
  const updated = [next, ...previous].slice(0, MAX_ITEMS);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore quota / private mode
  }

  return updated;
};

export const clearRecentSearches = (): void => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};
