import { kbdAccent } from '@/styles/common';
import styled, { css, keyframes } from 'styled-components';

/**
 * Spotlight color tokens (scoped recolor).
 * Klever brand purple retained as the single accent; entity type is carried by
 * icon shape + badge label (not rainbow icon hues).
 */
const t = {
  dark: {
    overlay: 'rgba(4, 4, 10, 0.62)',
    panel: '#12121A',
    panelBorder: 'rgba(255, 255, 255, 0.09)',
    panelShadow: '0 24px 64px rgba(0, 0, 0, 0.55)',
    divider: 'rgba(255, 255, 255, 0.07)',
    title: '#EDEDF5',
    subtitle: '#A8A9C4',
    kbdBg: 'rgba(255, 255, 255, 0.05)',
    kbdBorder: 'rgba(255, 255, 255, 0.1)',
    muted: 'rgba(168, 169, 196, 0.72)',
    mutedSoft: 'rgba(168, 169, 196, 0.5)',
    icon: '#C4B5FD',
    iconWell: 'rgba(196, 181, 253, 0.1)',
    iconWellBorder: 'rgba(196, 181, 253, 0.22)',
    activeBg: 'rgba(125, 63, 241, 0.14)',
    activeRail: '#9B6CFF',
    hoverBg: 'rgba(255, 255, 255, 0.04)',
    // Quiet outline tags (secondary), not CTA-level purple fills
    badgeBg: 'rgba(255, 255, 255, 0.03)',
    badgeBorder: 'rgba(255, 255, 255, 0.1)',
    badgeText: 'rgba(168, 169, 196, 0.9)',
    footerBg: 'rgba(0, 0, 0, 0.28)',
    selection: 'rgba(155, 108, 255, 0.4)',
    spinnerTrack: 'rgba(155, 108, 255, 0.22)',
    spinnerHead: '#9B6CFF',
    brand: 'rgba(168, 169, 196, 0.45)',
  },
  light: {
    overlay: 'rgba(10, 10, 18, 0.4)',
    panel: '#FFFFFF',
    panelBorder: 'rgba(0, 0, 0, 0.08)',
    panelShadow: '0 20px 50px rgba(15, 15, 30, 0.18)',
    divider: 'rgba(0, 0, 0, 0.07)',
    title: '#12121A',
    subtitle: '#5C5E78',
    kbdBg: 'rgba(0, 0, 0, 0.04)',
    kbdBorder: 'rgba(0, 0, 0, 0.08)',
    muted: '#6B6D88',
    mutedSoft: '#8A8BA3',
    icon: '#7D3FF1',
    iconWell: 'rgba(125, 63, 241, 0.08)',
    iconWellBorder: 'rgba(125, 63, 241, 0.16)',
    activeBg: 'rgba(125, 63, 241, 0.08)',
    activeRail: '#7D3FF1',
    hoverBg: 'rgba(0, 0, 0, 0.03)',
    badgeBg: 'rgba(0, 0, 0, 0.02)',
    badgeBorder: 'rgba(0, 0, 0, 0.1)',
    badgeText: '#6B6D88',
    footerBg: 'rgba(244, 244, 248, 0.9)',
    selection: 'rgba(125, 63, 241, 0.28)',
    spinnerTrack: 'rgba(125, 63, 241, 0.2)',
    spinnerHead: '#7D3FF1',
    brand: '#8A8BA3',
  },
};

const tokens = (dark?: boolean) => (dark ? t.dark : t.light);

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const panelIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const resultIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: min(18vh, 8rem) 1rem 2rem;
  background: ${props => tokens(props.theme.dark).overlay};
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
  animation: ${fadeIn} 0.15s ease-out;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 12vh 0.75rem 1rem;
  }
`;

export const PanelShell = styled.div`
  position: relative;
  width: min(640px, 100%);
  z-index: 1;
  animation: ${panelIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 16px;

  @media (prefers-reduced-motion: reduce) {
    animation: ${fadeIn} 0.12s ease-out;
  }
`;

export const Panel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: min(72vh, 560px);
  border-radius: 16px;
  overflow: hidden;
  background: ${props => tokens(props.theme.dark).panel};
  border: 1px solid ${props => tokens(props.theme.dark).panelBorder};
  box-shadow: ${props => tokens(props.theme.dark).panelShadow};
`;

export const SearchRow = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.1rem 0.9rem;
  border-bottom: 1px solid ${props => tokens(props.theme.dark).divider};
`;

export const SearchIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  color: ${props => tokens(props.theme.dark).icon};

  svg {
    width: 1.05rem;
    height: 1.05rem;

    path {
      fill: currentColor;
    }
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: ${props => tokens(props.theme.dark).title} !important;
  background: transparent !important;

  &::placeholder {
    color: ${props => tokens(props.theme.dark).mutedSoft};
    font-weight: 400;
  }

  &::selection {
    background: ${props => tokens(props.theme.dark).selection};
  }
`;

export const Kbd = styled.kbd`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.4rem;
  padding: 0 0.4rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: 0.02em;
  ${kbdAccent}
`;

export const EscHint = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
`;

export const Body = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem 0.5rem 0.6rem;
  scrollbar-width: thin;
  scrollbar-color: ${props => tokens(props.theme.dark).spinnerTrack} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => tokens(props.theme.dark).spinnerTrack};
    border-radius: 999px;
  }
`;

export const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.75rem 0.35rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${props => tokens(props.theme.dark).mutedSoft};
`;

/** Soft type-run header inside a score-ordered list (does not re-sort). */
export const TypeRunLabel = styled.li`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  list-style: none;
  padding: 0.45rem 0.75rem 0.2rem;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${props => tokens(props.theme.dark).mutedSoft};

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => tokens(props.theme.dark).divider};
    opacity: 0.85;
  }
`;

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: 0.45rem 0.65rem 0.35rem;
`;

export const FilterChip = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${props =>
    props.$active
      ? tokens(props.theme.dark).title
      : tokens(props.theme.dark).subtitle};
  background: ${props =>
    props.$active
      ? tokens(props.theme.dark).activeBg
      : tokens(props.theme.dark).kbdBg};
  border: 1px solid
    ${props =>
      props.$active
        ? tokens(props.theme.dark).iconWellBorder
        : tokens(props.theme.dark).kbdBorder};
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    color 0.12s ease;

  &:hover {
    background: ${props => tokens(props.theme.dark).activeBg};
  }
`;

export const FilterCount = styled.span`
  font-variant-numeric: tabular-nums;
  opacity: 0.75;
  font-weight: 500;
`;

export const InlineFetch = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.4rem;
  padding: 0.15rem 0.85rem 0.35rem;
  font-size: 0.7rem;
  font-weight: 500;
  color: ${props => tokens(props.theme.dark).mutedSoft};
`;

export const TitleRow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  max-width: 100%;
`;

export const ClearRecent = styled.button`
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${props => tokens(props.theme.dark).badgeText};
  opacity: 0.9;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
`;

export const ResultList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
`;

export const ResultItem = styled.li<{ $active?: boolean; $delay?: number }>`
  animation: ${resultIn} 0.18s ease-out both;
  animation-delay: ${props => (props.$delay ?? 0) * 20}ms;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const ResultButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: 2.25rem minmax(0, 1fr) auto 1rem;
  align-items: center;
  column-gap: 0.75rem;
  min-height: 3.15rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  text-align: left;
  color: inherit;
  transition: background 0.12s ease;
  position: relative;

  ${props =>
    props.$active
      ? css`
          background: ${tokens(props.theme.dark).activeBg};

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 18%;
            bottom: 18%;
            width: 2px;
            border-radius: 0 2px 2px 0;
            background: ${tokens(props.theme.dark).activeRail};
          }
        `
      : css`
          &:hover {
            background: ${tokens(props.theme.dark).hoverBg};
          }
        `}
`;

export const ResultIcon = styled.div<{ $tone?: string; $plain?: boolean }>`
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${props =>
    props.$plain ? 'transparent' : tokens(props.theme.dark).iconWell};
  border: 1px solid
    ${props =>
      props.$plain ? 'transparent' : tokens(props.theme.dark).iconWellBorder};
  color: ${props => props.$tone || tokens(props.theme.dark).icon};
  font-size: 1rem;

  svg {
    width: 1.05rem;
    height: 1.05rem;
  }
`;

export const ResultText = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.15rem;
`;

export const ResultTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: ${props => tokens(props.theme.dark).title};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ResultSubtitle = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.25;
  color: ${props => tokens(props.theme.dark).subtitle};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-variant-numeric: tabular-nums;
`;

export const TypeBadge = styled.span`
  justify-self: end;
  min-width: 4.25rem;
  text-align: center;
  padding: 0.18rem 0.45rem;
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${props => tokens(props.theme.dark).badgeText};
  background: ${props => tokens(props.theme.dark).badgeBg};
  border: 1px solid ${props => tokens(props.theme.dark).badgeBorder};
`;

export const ResultChevron = styled.span<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => tokens(props.theme.dark).muted};
  opacity: ${props => (props.$active ? 1 : 0.5)};
  transition: opacity 0.12s ease;

  svg {
    width: 0.95rem;
    height: 0.95rem;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.45rem;
  padding: 1.5rem 1.15rem 1.25rem;
`;

export const EmptyTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 700;
  color: ${props => tokens(props.theme.dark).title};
`;

export const EmptyText = styled.p`
  max-width: 28rem;
  font-size: 0.8rem;
  line-height: 1.5;
  color: ${props => tokens(props.theme.dark).subtitle};
`;

export const HintGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem;
  width: 100%;
  max-width: 22rem;
  margin-top: 0.55rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const HintChip = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 600;
  color: ${props => tokens(props.theme.dark).subtitle};
  background: ${props => tokens(props.theme.dark).kbdBg};
  border: 1px solid ${props => tokens(props.theme.dark).kbdBorder};
  transition:
    background 0.12s ease,
    border-color 0.12s ease;

  &:hover {
    background: ${props => tokens(props.theme.dark).activeBg};
    border-color: ${props => tokens(props.theme.dark).badgeBorder};
  }
`;

export const LoadingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1.5rem 1rem;
  color: ${props => tokens(props.theme.dark).subtitle};
  font-size: 0.85rem;
  font-weight: 500;
`;

export const Spinner = styled.div<{ $size?: number }>`
  width: ${props => (props.$size ? `${props.$size}px` : '1rem')};
  height: ${props => (props.$size ? `${props.$size}px` : '1rem')};
  border-radius: 50%;
  border: 2px solid ${props => tokens(props.theme.dark).spinnerTrack};
  border-top-color: ${props => tokens(props.theme.dark).spinnerHead};
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;
`;

export const Footer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.55rem 0.95rem;
  border-top: 1px solid ${props => tokens(props.theme.dark).divider};
  background: ${props => tokens(props.theme.dark).footerBg};
`;

export const FooterHints = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.7rem;
`;

export const FooterHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  font-size: 0.68rem;
  font-weight: 500;
  color: ${props => tokens(props.theme.dark).mutedSoft};

  ${Kbd} {
    min-width: 1.2rem;
    height: 1.15rem;
    font-size: 0.6rem;
  }
`;

export const BrandMark = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${props => tokens(props.theme.dark).brand};
`;
