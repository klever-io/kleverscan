import styled from 'styled-components';

export const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.black10};
  border-radius: 8px;
  overflow: hidden;
`;

const gridColumns = `
  display: grid;
  grid-template-columns: minmax(120px, 1fr) minmax(0, 2fr);
  gap: 1rem;
  padding: 0.55rem 0.75rem;
`;

export const HeaderRow = styled.div`
  ${gridColumns}
  background: ${({ theme }) => (theme.dark ? theme.black20 : theme.black10)};

  span {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    opacity: 0.7;
    color: ${({ theme }) => theme.black};
  }
`;

export const Row = styled.div`
  ${gridColumns}
  align-items: start;
  border-top: 1px solid ${({ theme }) => theme.black10};
`;

export const TopicCell = styled.div`
  min-width: 0;
`;

export const DataCell = styled.div`
  min-width: 0;
`;

// A value plus its format dropdown.
export const Cell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
`;

export const Mono = styled.pre`
  margin: 0;
  flex: 1;
  min-width: 0;
  font-family: monospace;
  font-size: 0.78rem;
  white-space: pre-wrap;
  word-break: break-all;
  opacity: 0.9;
  color: ${({ theme }) => theme.black};
`;

export const FormatSelect = styled.select`
  flex-shrink: 0;
  font-size: 0.68rem;
  padding: 0.1rem 0.25rem;
  border: 1px solid ${({ theme }) => theme.black20};
  border-radius: 4px;
  background: transparent;
  color: ${({ theme }) => theme.black};
  cursor: pointer;
`;

export const Empty = styled.span`
  opacity: 0.4;
  color: ${({ theme }) => theme.black};
`;
