import styled, { keyframes } from 'styled-components';

export const InteractionSection = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const EndpointCard = styled.div`
  border: 1px solid ${({ theme }) => theme.black20};
  border-radius: 8px;
  overflow: hidden;
`;

export const EndpointHeader = styled.button<{ open: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: none;
  background: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.black};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.black10};
  }

  &::before {
    content: '${({ open }) => (open ? '▾' : '▸')}';
    font-size: 0.65rem;
    width: 12px;
    text-align: center;
    flex-shrink: 0;
  }
`;

export const EndpointBody = styled.div`
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.black20};
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const InputLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.black};

  span {
    font-weight: 400;
    opacity: 0.6;
  }
`;

export const InputField = styled.input`
  padding: 0.45rem 0.65rem;
  border: 1px solid ${({ theme }) => theme.black20};
  border-radius: 6px;
  background: transparent;
  color: ${({ theme }) => theme.black};
  font-size: 0.825rem;
  outline: none;
  font-family: monospace;

  &:focus {
    border-color: ${({ theme }) => theme.violet};
  }

  &::placeholder {
    opacity: 0.4;
  }
`;

export const QueryButton = styled.button`
  align-self: flex-start;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  border: none;
  background: ${({ theme }) => theme.violet};
  color: ${({ theme }) => theme.true.white};
  font-weight: 600;
  font-size: 0.825rem;
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

export const WriteButton = styled(QueryButton)`
  background: ${({ theme }) => theme.green};
`;

export const ResultBox = styled.div<{ isError?: boolean }>`
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  background: ${({ theme }) => theme.white};
  color: ${({ theme, isError }) => (isError ? theme.error : theme.black)};
  border: 1px solid
    ${({ theme, isError }) => (isError ? theme.error : theme.black20)};
`;

export const ResultLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.6;
`;

export const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.black};
  opacity: 0.6;
  font-size: 0.9rem;
`;

export const ConnectWalletMessage = styled.div`
  padding: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.black};
  opacity: 0.7;
`;

export const TxHashLink = styled.a`
  color: ${({ theme }) => theme.violet};
  font-size: 0.825rem;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  margin-right: 0.3rem;
`;

export const OutputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

export const CallValueSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed ${({ theme }) => theme.black20};
`;

export const CallValueRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
`;
