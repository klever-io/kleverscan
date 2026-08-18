import { Search } from '@/assets/icons';
import AssetLogo from '@/components/Logo/AssetLogo';
import { navbarItems } from '@/configs/navbar';
import { useSpotlight } from '@/contexts/spotlight';
import { useTheme } from '@/contexts/theme';
import {
  fetchSpotlightSearch,
  SpotlightApiItem,
  toDisplayItem,
  typeLabelForSpotlight,
} from '@/services/requests/searchBar/spotlightSearch';
import { normalizeSearchQuery } from '@/utils/search/getInputType';
import {
  clearRecentSearches,
  loadRecentSearches,
  RecentSearchItem,
  saveRecentSearch,
} from '@/utils/search/recentSearches';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import {
  FiArrowRight,
  FiBox,
  FiClock,
  FiCode,
  FiFileText,
  FiHash,
  FiLayers,
  FiNavigation,
  FiUser,
} from 'react-icons/fi';
import {
  Body,
  BrandMark,
  ClearRecent,
  EmptyState,
  EmptyText,
  EmptyTitle,
  EscHint,
  FilterBar,
  FilterChip,
  FilterCount,
  Footer,
  FooterHint,
  FooterHints,
  HintChip,
  HintGrid,
  InlineFetch,
  Kbd,
  LoadingRow,
  Overlay,
  Panel,
  PanelShell,
  ResultButton,
  ResultChevron,
  ResultIcon,
  ResultItem,
  ResultList,
  ResultSubtitle,
  ResultText,
  ResultTitle,
  SearchIconWrap,
  SearchInput,
  SearchRow,
  SectionLabel,
  Spinner,
  TitleRow,
  TypeBadge,
  TypeRunLabel,
} from './styles';

type SpotlightItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  typeLabel: string;
  apiType?: string;
  tone: string;
  icon: React.ReactNode;
  query?: string;
  kind: 'result' | 'nav' | 'recent' | 'suggestion';
  completeValue?: string;
  logo?: string;
  logoTicker?: string;
  logoName?: string;
  verified?: boolean;
};

type TypeFilterKey =
  | 'all'
  | 'asset'
  | 'account'
  | 'validator'
  | 'block'
  | 'transaction'
  | 'epoch'
  | 'proposal'
  | 'smartContract';

const ACCENT = '#C4B5FD';

const TYPE_FILTERS: { key: TypeFilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'asset', label: 'Assets' },
  { key: 'account', label: 'Accounts' },
  { key: 'validator', label: 'Validators' },
  { key: 'block', label: 'Blocks' },
  { key: 'transaction', label: 'Txs' },
  { key: 'proposal', label: 'Proposals' },
  { key: 'smartContract', label: 'Contracts' },
  { key: 'epoch', label: 'Epochs' },
];

const EXAMPLE_QUERIES = [
  { label: 'KLV asset', value: 'KLV' },
  { label: 'Block height', value: '1000' },
  { label: 'Proposal id', value: '28' },
  { label: 'Smart contract', value: 'swap' },
];

const iconForApiType = (type: string): React.ReactNode => {
  switch (type) {
    case 'asset':
      return <FiLayers />;
    case 'account':
      return <FiUser />;
    case 'validator':
      return <FiUser />;
    case 'block':
    case 'epoch':
      return <FiBox />;
    case 'transaction':
      return <FiHash />;
    case 'proposal':
      return <FiFileText />;
    case 'smartContract':
      return <FiCode />;
    default:
      return <FiHash />;
  }
};

const ItemVisual: React.FC<{ item: SpotlightItem; isDark: boolean }> = ({
  item,
  isDark,
}) => {
  if (item.logoTicker || item.logo !== undefined) {
    const hasRemoteLogo = Boolean(item.logo);
    return (
      <ResultIcon $plain={hasRemoteLogo}>
        <AssetLogo
          logo={item.logo || ''}
          ticker={item.logoTicker || item.title}
          name={item.logoName || item.title}
          size={28}
          verified={item.verified}
          invertColors={isDark && !hasRemoteLogo}
        />
      </ResultIcon>
    );
  }
  return <ResultIcon $tone={ACCENT}>{item.icon}</ResultIcon>;
};

const TypeMeta: React.FC<{ item: SpotlightItem }> = ({ item }) => {
  if (item.kind === 'nav' || item.typeLabel.toLowerCase() === 'page') {
    return <span aria-hidden />;
  }
  return <TypeBadge>{item.typeLabel}</TypeBadge>;
};

const SpotlightResultRow: React.FC<{
  item: SpotlightItem;
  index: number;
  active: boolean;
  isDark: boolean;
  delay?: number;
  onActivate: (index: number) => void;
  onSelect: (item: SpotlightItem) => void;
  subtitleOverride?: string;
}> = ({
  item,
  index,
  active,
  isDark,
  delay = 0,
  onActivate,
  onSelect,
  subtitleOverride,
}) => (
  <ResultItem $active={active} $delay={delay}>
    <ResultButton
      type="button"
      $active={active}
      data-spotlight-index={index}
      onMouseEnter={() => onActivate(index)}
      onClick={() => onSelect(item)}
    >
      <ItemVisual item={item} isDark={isDark} />
      <ResultText>
        <ResultTitle>
          <TitleRow>
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.title}
            </span>
          </TitleRow>
        </ResultTitle>
        <ResultSubtitle>{subtitleOverride ?? item.subtitle}</ResultSubtitle>
      </ResultText>
      <TypeMeta item={item} />
      <ResultChevron $active={active}>
        <FiArrowRight />
      </ResultChevron>
    </ResultButton>
  </ResultItem>
);

const mapApiItem = (
  item: SpotlightApiItem,
  query: string,
  kind: 'result' | 'suggestion',
): SpotlightItem => {
  const display = toDisplayItem(item);
  const hasLogoSlot =
    item.type === 'asset' || item.type === 'validator' || Boolean(display.logo);

  return {
    id: `${item.type}-${item.id}`,
    title: display.title,
    subtitle: display.subtitle,
    href: display.href,
    typeLabel: display.typeLabel,
    apiType: item.type,
    tone: ACCENT,
    icon: iconForApiType(item.type),
    query,
    kind,
    completeValue: display.completeValue,
    logo: hasLogoSlot ? display.logo || '' : undefined,
    logoTicker: hasLogoSlot
      ? display.logoTicker || display.title.slice(0, 3)
      : undefined,
    logoName: display.logoName || display.title,
    verified: display.verified,
  };
};

const flatNavItems = (): SpotlightItem[] => {
  const items: SpotlightItem[] = [];

  navbarItems.forEach(item => {
    if (item.pathTo) {
      items.push({
        id: `nav-${item.pathTo}`,
        title: item.name,
        subtitle: item.pathTo,
        href: item.pathTo,
        typeLabel: 'Page',
        tone: ACCENT,
        icon: <FiNavigation />,
        kind: 'nav',
      });
    }
    item.pages?.forEach(page => {
      if (!page.pathTo || page.pathTo.startsWith('http')) return;
      items.push({
        id: `nav-${page.pathTo}`,
        title: page.name,
        subtitle: page.pathTo,
        href: page.pathTo,
        typeLabel: 'Page',
        tone: ACCENT,
        icon: <FiNavigation />,
        kind: 'nav',
      });
    });
  });

  return items;
};

const mapRecent = (items: RecentSearchItem[]): SpotlightItem[] =>
  items.map(item => ({
    id: item.id,
    title: item.label,
    subtitle: item.query || 'Recent search',
    href: item.href,
    typeLabel: item.typeLabel,
    tone: ACCENT,
    icon: <FiClock />,
    query: item.query,
    kind: 'recent' as const,
  }));

/** Proxy min length: text needs 2 chars; pure numeric can be shorter. */
const canQueryServer = (q: string): boolean => {
  if (!q) return false;
  if (/^\d+$/.test(q)) return q.length >= 1;
  return q.length >= 2;
};

const itemKey = (item: { type?: string; id: string }) =>
  `${item.type || 'x'}-${item.id}`;

/**
 * Soft type-run labels while preserving score order.
 * Only when the list is mixed and long enough to benefit.
 */
const shouldShowTypeRuns = (items: SpotlightItem[]): boolean => {
  if (items.length < 4) return false;
  const types = new Set(items.map(i => i.apiType || i.typeLabel));
  return types.size >= 2;
};

const Spotlight: React.FC = () => {
  const { isOpen, closeSpotlight, initialQuery } = useSpotlight();
  const { isDarkTheme } = useTheme();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState<RecentSearchItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TypeFilterKey>('all');
  /** Counts from the last unfiltered response — keeps chips stable while filtered. */
  const allCountsRef = useRef<Record<string, number>>({});

  const navItems = useMemo(() => flatNavItems(), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setQuery(initialQuery || '');
    setDebouncedQuery(initialQuery || '');
    setActiveIndex(0);
    setTypeFilter('all');
    setRecent(loadRecentSearches());
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, [isOpen, initialQuery]);

  useEffect(() => {
    if (!isOpen) return;
    const handle = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);
    return () => window.clearTimeout(handle);
  }, [query, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Keep original casing for API match scoring; only strip whitespace / 0x.
  const searchQuery = useMemo(
    () => normalizeSearchQuery(debouncedQuery),
    [debouncedQuery],
  );

  const wantsServerSearch = isOpen && canQueryServer(searchQuery);

  const typesParam = useMemo(
    () => (typeFilter === 'all' ? undefined : [typeFilter]),
    [typeFilter],
  );

  const {
    data: serverData,
    isFetching,
    isPending,
  } = useQuery({
    queryKey: ['spotlight-search-v2', searchQuery, typeFilter],
    queryFn: () =>
      fetchSpotlightSearch(searchQuery, { limit: 12, types: typesParam }),
    enabled: wantsServerSearch,
    staleTime: 30_000,
    // Keep previous hits visible while typing / filter changes (no full wipe).
    placeholderData: keepPreviousData,
  });

  const searchUnavailable = Boolean(
    wantsServerSearch && serverData?.unavailable && !isFetching,
  );

  const bestMatchItem = useMemo((): SpotlightItem | null => {
    if (!serverData?.bestMatch || serverData.unavailable) return null;
    // When filtering by type, only show best match if it matches filter.
    if (typeFilter !== 'all' && serverData.bestMatch.type !== typeFilter) {
      return null;
    }
    return mapApiItem(serverData.bestMatch, searchQuery, 'result');
  }, [serverData, searchQuery, typeFilter]);

  const suggestionItems = useMemo((): SpotlightItem[] => {
    if (!serverData?.suggestions?.length || serverData.unavailable) return [];
    const bestKey = serverData.bestMatch ? itemKey(serverData.bestMatch) : null;
    return serverData.suggestions
      .filter(s => !bestKey || itemKey(s) !== bestKey)
      .map(s => mapApiItem(s, searchQuery, 'suggestion'));
  }, [serverData, searchQuery]);

  const filteredNav = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return navItems.slice(0, 6);
    return navItems
      .filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.href.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [navItems, searchQuery]);

  const recentItems = useMemo(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return mapRecent(
        recent.filter(
          r =>
            r.label.toLowerCase().includes(q) ||
            r.query.toLowerCase().includes(q) ||
            r.href.toLowerCase().includes(q),
        ),
      ).slice(0, 5);
    }
    return mapRecent(recent).slice(0, 5);
  }, [recent, searchQuery]);

  const flatItems = useMemo(() => {
    const items: SpotlightItem[] = [];
    if (bestMatchItem) items.push(bestMatchItem);
    items.push(...suggestionItems);
    // Hide recent/nav under a type filter so chips only scope entity results.
    if (typeFilter === 'all') {
      items.push(...recentItems);
      items.push(...filteredNav);
    }
    const seen = new Set<string>();
    return items.filter(item => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    });
  }, [bestMatchItem, suggestionItems, recentItems, filteredNav, typeFilter]);

  const showTypeRuns = useMemo(
    () => shouldShowTypeRuns(suggestionItems),
    [suggestionItems],
  );

  useEffect(() => {
    if (
      typeFilter === 'all' &&
      serverData?.counts &&
      !serverData.unavailable &&
      Object.keys(serverData.counts).length > 0
    ) {
      allCountsRef.current = serverData.counts;
    }
  }, [typeFilter, serverData]);

  const counts =
    typeFilter === 'all'
      ? serverData?.counts || allCountsRef.current
      : allCountsRef.current;
  const showFilters =
    wantsServerSearch &&
    !searchUnavailable &&
    (Object.keys(counts).length > 0 || typeFilter !== 'all');

  useEffect(() => {
    setActiveIndex(0);
  }, [
    searchQuery,
    typeFilter,
    bestMatchItem?.id,
    suggestionItems.length,
    filteredNav.length,
  ]);

  useEffect(() => {
    if (!panelRef.current) return;
    const el = panelRef.current.querySelector<HTMLElement>(
      `[data-spotlight-index="${activeIndex}"]`,
    );
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const navigateTo = useCallback(
    (item: SpotlightItem) => {
      if (
        item.kind === 'result' ||
        item.kind === 'recent' ||
        item.kind === 'suggestion'
      ) {
        setRecent(
          saveRecentSearch({
            label: item.completeValue || item.title,
            href: item.href,
            typeLabel: item.typeLabel,
            query: item.query || query,
          }),
        );
      }
      closeSpotlight();
      if (item.href.startsWith('http')) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
        return;
      }
      router.push(item.href);
    },
    [closeSpotlight, query, router],
  );

  const completeActive = useCallback(() => {
    const item = flatItems[activeIndex];
    if (!item?.completeValue) return false;
    setQuery(item.completeValue);
    setDebouncedQuery(item.completeValue);
    return true;
  }, [flatItems, activeIndex]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeSpotlight();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex(i => (flatItems.length ? (i + 1) % flatItems.length : 0));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(i =>
        flatItems.length ? (i - 1 + flatItems.length) % flatItems.length : 0,
      );
      return;
    }
    if (event.key === 'Tab') {
      if (completeActive()) event.preventDefault();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const item = flatItems[activeIndex];
      if (item) navigateTo(item);
    }
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecent([]);
  };

  if (!mounted || !isOpen) return null;

  const hasServerHits = Boolean(bestMatchItem || suggestionItems.length);
  const showInitialLoading =
    wantsServerSearch && isPending && !serverData && !hasServerHits;
  const showInlineFetch = wantsServerSearch && isFetching && hasServerHits;

  const showNoResults =
    Boolean(searchQuery) &&
    canQueryServer(searchQuery) &&
    !isFetching &&
    !searchUnavailable &&
    !hasServerHits &&
    (typeFilter !== 'all' ||
      (recentItems.length === 0 && filteredNav.length === 0));

  const renderSuggestionRows = () => {
    let lastType: string | undefined;
    return suggestionItems.map(item => {
      const index = flatItems.findIndex(i => i.id === item.id);
      if (index < 0) return null;

      const typeKey = item.apiType || item.typeLabel;
      const showRun = showTypeRuns && typeKey && typeKey !== lastType;
      lastType = typeKey;

      return (
        <React.Fragment key={item.id}>
          {showRun && (
            <TypeRunLabel aria-hidden>
              {typeLabelForSpotlight(typeKey)}
            </TypeRunLabel>
          )}
          <SpotlightResultRow
            item={item}
            index={index}
            active={index === activeIndex}
            isDark={isDarkTheme}
            delay={Math.min(index, 8)}
            onActivate={setActiveIndex}
            onSelect={navigateTo}
          />
        </React.Fragment>
      );
    });
  };

  const content = (
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight search"
      data-testid="spotlight-overlay"
      onMouseDown={e => {
        if (e.target === e.currentTarget) closeSpotlight();
      }}
    >
      <PanelShell>
        <Panel ref={panelRef} onKeyDown={onKeyDown}>
          <SearchRow>
            <SearchIconWrap aria-hidden>
              <Search />
            </SearchIconWrap>
            <SearchInput
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search address, tx, block, asset, or jump to a page…"
              aria-label="Spotlight search"
              data-testid="spotlight-input"
              autoComplete="off"
              spellCheck={false}
            />
            <EscHint>
              {isFetching && wantsServerSearch && (
                <Spinner $size={14} aria-hidden />
              )}
              <Kbd>esc</Kbd>
            </EscHint>
          </SearchRow>

          {showFilters && (
            <FilterBar role="tablist" aria-label="Filter by type">
              {TYPE_FILTERS.map(f => {
                const count =
                  f.key === 'all'
                    ? Object.values(counts).reduce((a, b) => a + b, 0)
                    : counts[f.key];
                // Hide empty type chips except active + All
                if (
                  f.key !== 'all' &&
                  f.key !== typeFilter &&
                  (!count || count <= 0)
                ) {
                  return null;
                }
                return (
                  <FilterChip
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={typeFilter === f.key}
                    $active={typeFilter === f.key}
                    onClick={() => setTypeFilter(f.key)}
                  >
                    {f.label}
                    {typeof count === 'number' && count > 0 && (
                      <FilterCount>{count}</FilterCount>
                    )}
                  </FilterChip>
                );
              })}
            </FilterBar>
          )}

          <Body>
            {showInitialLoading && (
              <LoadingRow>
                <Spinner />
                Searching…
              </LoadingRow>
            )}

            {showInlineFetch && (
              <InlineFetch>
                <Spinner $size={12} />
                Updating…
              </InlineFetch>
            )}

            {searchUnavailable && !showInitialLoading && (
              <EmptyState>
                <EmptyTitle>Search unavailable</EmptyTitle>
                <EmptyText>
                  Could not reach the search API. Check that the proxy is
                  running, or try again in a moment.
                </EmptyText>
              </EmptyState>
            )}

            {!showInitialLoading && !searchUnavailable && bestMatchItem && (
              <>
                <SectionLabel>Best match</SectionLabel>
                <ResultList>
                  {flatItems
                    .filter(i => i.kind === 'result')
                    .map(item => {
                      const index = flatItems.indexOf(item);
                      return (
                        <SpotlightResultRow
                          key={item.id}
                          item={item}
                          index={index}
                          active={index === activeIndex}
                          isDark={isDarkTheme}
                          onActivate={setActiveIndex}
                          onSelect={navigateTo}
                        />
                      );
                    })}
                </ResultList>
              </>
            )}

            {!showInitialLoading &&
              !searchUnavailable &&
              suggestionItems.length > 0 && (
                <>
                  <SectionLabel>
                    {typeFilter === 'all'
                      ? 'Suggestions'
                      : typeLabelForSpotlight(typeFilter)}
                  </SectionLabel>
                  <ResultList>{renderSuggestionRows()}</ResultList>
                </>
              )}

            {showNoResults && (
              <EmptyState>
                <EmptyTitle>No results found</EmptyTitle>
                <EmptyText>
                  {typeFilter !== 'all'
                    ? `No ${typeLabelForSpotlight(typeFilter).toLowerCase()} matches for “${searchQuery}”. Try All or another query.`
                    : `Nothing matched “${searchQuery}”. Try another address, hash, asset ticker, validator name, or block height.`}
                </EmptyText>
              </EmptyState>
            )}

            {typeFilter === 'all' && recentItems.length > 0 && (
              <>
                <SectionLabel>
                  <span>Recent</span>
                  {!searchQuery && (
                    <ClearRecent type="button" onClick={handleClearRecent}>
                      Clear
                    </ClearRecent>
                  )}
                </SectionLabel>
                <ResultList>
                  {recentItems.map(item => {
                    const index = flatItems.findIndex(i => i.id === item.id);
                    if (index < 0) return null;
                    return (
                      <SpotlightResultRow
                        key={item.id}
                        item={item}
                        index={index}
                        active={index === activeIndex}
                        isDark={isDarkTheme}
                        delay={Math.min(index, 8)}
                        onActivate={setActiveIndex}
                        onSelect={navigateTo}
                      />
                    );
                  })}
                </ResultList>
              </>
            )}

            {typeFilter === 'all' && filteredNav.length > 0 && (
              <>
                <SectionLabel>{searchQuery ? 'Pages' : 'Jump to'}</SectionLabel>
                <ResultList>
                  {filteredNav.map(item => {
                    const index = flatItems.findIndex(i => i.id === item.id);
                    if (index < 0) return null;
                    return (
                      <SpotlightResultRow
                        key={item.id}
                        item={item}
                        index={index}
                        active={index === activeIndex}
                        isDark={isDarkTheme}
                        delay={Math.min(index, 8)}
                        onActivate={setActiveIndex}
                        onSelect={navigateTo}
                        subtitleOverride={item.href}
                      />
                    );
                  })}
                </ResultList>
              </>
            )}

            {!searchQuery &&
              recentItems.length === 0 &&
              filteredNav.length === 0 && (
                <EmptyState>
                  <EmptyTitle>Search Klever Explorer</EmptyTitle>
                  <EmptyText>
                    Address, transaction hash, block, asset, or smart contract.
                  </EmptyText>
                  <HintGrid>
                    {EXAMPLE_QUERIES.map(example => (
                      <HintChip
                        key={example.label}
                        type="button"
                        onClick={() => {
                          setQuery(example.value);
                          inputRef.current?.focus();
                        }}
                      >
                        <FiHash />
                        {example.label}
                      </HintChip>
                    ))}
                  </HintGrid>
                </EmptyState>
              )}
          </Body>

          <Footer>
            <FooterHints>
              <FooterHint>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                navigate
              </FooterHint>
              <FooterHint>
                <Kbd>↵</Kbd>
                open
              </FooterHint>
              <FooterHint>
                <Kbd>tab</Kbd>
                complete
              </FooterHint>
              <FooterHint>
                <Kbd>esc</Kbd>
                close
              </FooterHint>
            </FooterHints>
            <BrandMark>Klever Spotlight</BrandMark>
          </Footer>
        </Panel>
      </PanelShell>
    </Overlay>
  );

  return createPortal(content, document.body);
};

export default Spotlight;
