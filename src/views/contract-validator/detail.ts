import styled from 'styled-components';
import Link from 'next/link';

export const Content = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.black};
  opacity: 0.75;
  font-size: 0.9rem;
  line-height: 1.5;
  max-width: 720px;
`;

// Self-contained card. We deliberately do NOT reuse the shared common `Card`,
// whose blanket `div { flex-direction: row; justify-content: space-between }`
// descendant rule (for key/value detail rows) leaks into and breaks form layouts.
export const Panel = styled.div`
  width: 100%;
  padding: 1rem;
  /* The raised surface, as everywhere else: #fff light, #151515 dark. */
  background-color: ${({ theme }) => theme.white};
  border: 1px solid
    ${({ theme }) => (theme.dark ? theme.black20 : theme.black10)};
  border-radius: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.4rem;
  color: ${({ theme }) => theme.black};

  label {
    font-size: 0.875rem;
    font-weight: 600;
  }

  input[type='text'] {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid ${({ theme }) => theme.black20};
    border-radius: 8px;
    background: transparent;
    color: ${({ theme }) => theme.black};
    font-size: 0.875rem;
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.violet};
    }
  }

  small {
    font-size: 0.75rem;
    opacity: 0.6;
  }
`;

export const FieldRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;

  > * {
    flex: 1 1 220px;
  }
`;

export const FileName = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.violet};
  font-weight: 600;
`;

export const SubmitButton = styled.button`
  align-self: flex-start;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.violet};
  color: ${({ theme }) => theme.true.white};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    opacity: 0.85;
  }
`;

export const FeeNote = styled.small`
  color: ${({ theme }) => theme.black};
  opacity: 0.7;
  font-size: 0.8rem;
`;

export const StatusText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.black};
  opacity: 0.85;
`;

export const ResultCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1.5rem;
`;

export const MatchBadge = styled.span<{ matched: boolean }>`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.9rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  background: ${({ matched, theme }) => (matched ? theme.green : theme.error)};
  color: ${({ theme }) => theme.true.white};
`;

export const ResultRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: baseline;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.black};

  strong {
    min-width: 130px;
  }

  span {
    font-family: monospace;
    word-break: break-all;
    opacity: 0.85;
  }
`;

export const ErrorBox = styled.pre`
  background: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.error};
  border: 1px solid ${({ theme }) => theme.error};
  border-radius: 8px;
  padding: 0.85rem;
  font-size: 0.8rem;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
`;

// -- Validation history -------------------------------------------------------

export const HistoryTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.black};
  margin-bottom: 0.75rem;
`;

export const HistoryEmpty = styled.p`
  font-size: 0.85rem;
  opacity: 0.65;
  color: ${({ theme }) => theme.black};
  margin: 0;
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const HistoryItem = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.black10};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    border-radius: 16px;
  }
`;

export const HistoryLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
`;

export const HistoryDate = styled.span`
  font-size: 0.72rem;
  opacity: 0.6;
  color: ${({ theme }) => theme.black};
`;

export const HistoryVersions = styled.span`
  font-size: 0.72rem;
  opacity: 0.7;
  color: ${({ theme }) => theme.black};
`;

// Center column: compiled vs on-chain hashes (shown once a check completes).
export const HistoryHashes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
`;

export const HistoryHashRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  color: ${({ theme }) => theme.black};

  strong {
    font-size: 0.8rem;
    font-weight: 600;
    opacity: 0.6;
    flex-shrink: 0;
    min-width: 62px;
  }

  pre {
    margin: 0;
    font-family: monospace;
    font-size: 0.82rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    opacity: 0.9;
  }

  /* Keep the copy icon compact and aligned. */
  button {
    flex-shrink: 0;
  }
`;

type PillTone = 'match' | 'nomatch' | 'pending' | 'failed';

export const Pill = styled.span<{ tone: PillTone }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.7rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.true.white};
  background: ${({ tone, theme }) => {
    if (tone === 'match') return theme.green;
    if (tone === 'nomatch' || tone === 'failed') return theme.error;
    return theme.black20;
  }};
  ${({ tone, theme }) => tone === 'pending' && `color: ${theme.black};`}
`;

// -- Owner disclaimer modal ---------------------------------------------------

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
`;

export const ModalBox = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 1.75rem;
  border-radius: 16px;
  /* The raised surface, as everywhere else: #fff light, #151515 dark. */
  background-color: ${({ theme }) => theme.white};
  border: 1px solid
    ${({ theme }) => (theme.dark ? theme.black20 : theme.black10)};
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

export const ModalTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ theme }) => theme.black};
  margin: 0;
`;

export const ModalText = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.black};
  opacity: 0.8;
  margin: 0;
`;

export const ModalActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const ModalPrimaryLink = styled(Link)`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.violet};
  color: ${({ theme }) => theme.true.white};
  font-weight: 600;
  font-size: 0.875rem;

  &:hover {
    opacity: 0.85;
  }
`;

export const ModalSecondaryButton = styled.button`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.black20};
  background: transparent;
  color: ${({ theme }) => theme.black};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;
