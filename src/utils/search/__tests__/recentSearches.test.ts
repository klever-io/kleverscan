import {
  clearRecentSearches,
  loadRecentSearches,
  saveRecentSearch,
} from '../recentSearches';

const STORAGE_KEY = 'kleverscan:spotlight-recent';

describe('recentSearches', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns empty when storage is empty', () => {
    expect(loadRecentSearches()).toEqual([]);
  });

  it('saves and loads recent items (newest first)', () => {
    saveRecentSearch({
      label: 'KLV',
      href: '/asset/KLV',
      typeLabel: 'Asset',
      query: 'KLV',
    });
    saveRecentSearch({
      label: '100',
      href: '/block/100',
      typeLabel: 'Block',
      query: '100',
    });

    const items = loadRecentSearches();
    expect(items).toHaveLength(2);
    expect(items[0].href).toBe('/block/100');
    expect(items[1].href).toBe('/asset/KLV');
    expect(items[0].id).toContain('/block/100');
  });

  it('dedupes by href and moves to front', () => {
    saveRecentSearch({
      label: 'KLV',
      href: '/asset/KLV',
      typeLabel: 'Asset',
      query: 'KLV',
    });
    saveRecentSearch({
      label: '100',
      href: '/block/100',
      typeLabel: 'Block',
      query: '100',
    });
    saveRecentSearch({
      label: 'Klever',
      href: '/asset/KLV',
      typeLabel: 'Asset',
      query: 'klv',
    });

    const items = loadRecentSearches();
    expect(items).toHaveLength(2);
    expect(items[0].href).toBe('/asset/KLV');
    expect(items[0].label).toBe('Klever');
  });

  it('caps at 8 items', () => {
    for (let i = 0; i < 12; i += 1) {
      saveRecentSearch({
        label: `item-${i}`,
        href: `/item/${i}`,
        typeLabel: 'Page',
        query: String(i),
      });
    }
    expect(loadRecentSearches()).toHaveLength(8);
    expect(loadRecentSearches()[0].href).toBe('/item/11');
  });

  it('clears storage', () => {
    saveRecentSearch({
      label: 'KLV',
      href: '/asset/KLV',
      typeLabel: 'Asset',
      query: 'KLV',
    });
    clearRecentSearches();
    expect(loadRecentSearches()).toEqual([]);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('returns empty on corrupt JSON', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not-json');
    expect(loadRecentSearches()).toEqual([]);
  });
});
