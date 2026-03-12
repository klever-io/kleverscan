import { ValidationJobStatus } from '@/types/smart-contract';
import styled, { css, keyframes } from 'styled-components';

export const StatusBadge = styled.span<{ status: ValidationJobStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ status, theme }) => {
    if (status === 'completed') return theme.green;
    if (status === 'failed') return theme.error;
    return theme.black20;
  }};
  color: ${({ status, theme }) => {
    if (status === 'pending' || status === 'running') return theme.true.black;
    return theme.true.white;
  }};
`;

export const UploadCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  color: ${({ theme }) => theme.black};

  label {
    font-size: 0.875rem;
    font-weight: 600;
  }

  input[type='text'],
  input[type='file'] {
    padding: 0.5rem 0.75rem;
    border: 1px solid ${({ theme }) => theme.black20};
    border-radius: 8px;
    background: transparent;
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

export const SubmitButton = styled.button`
  align-self: flex-start;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.violet};
  color: ${({ theme }) => theme.true.white};
  font-weight: 600;
  font-size: 0.875rem;
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

export const JobStatusCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
`;

export const JobRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;

  strong {
    min-width: 100px;
  }
`;

export const ErrorBox = styled.pre`
  background: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.error};
  border: 1px solid ${({ theme }) => theme.error};
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.8rem;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
`;

export const CodeBlockWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
`;

export const MonacoWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.black20};
`;

export const IdeLayout = styled.div`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.black20};
  height: 520px;
`;

export const IdeSidebar = styled.div`
  width: 220px;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.white};
  border-right: 1px solid ${({ theme }) => theme.black20};
  overflow-y: auto;
`;

export const IdeSidebarTitle = styled.div`
  padding: 0.5rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.gray800};
  user-select: none;
`;

export const IdeFolder = styled.div`
  display: flex;
  flex-direction: column;
`;

export const IdeFolderHeader = styled.button<{ open: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.black};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: ${({ theme }) => theme.black10};
  }

  &::before {
    content: '${({ open }) => (open ? '▾' : '▸')}';
    font-size: 0.65rem;
    width: 12px;
    text-align: center;
  }
`;

export const IdeFileItem = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.5rem 0.2rem 1.75rem;
  border: none;
  background: ${({ active, theme }) =>
    active ? theme.black20 : 'transparent'};
  color: ${({ theme }) => theme.black};
  font-size: 0.8rem;
  cursor: pointer;
  text-align: left;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: ${({ theme }) => theme.black10};
  }
`;

export const IdeFileIcon = styled.span<{ type: 'rust' | 'json' }>`
  font-size: 0.75rem;
  flex-shrink: 0;
  color: ${({ type, theme }) =>
    type === 'rust' ? theme.ide.rustIcon : theme.ide.jsonIcon};
`;

export const IdeEditorPane = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const IdeEditorTabBar = styled.div`
  display: flex;
  background: ${({ theme }) => theme.background};
  overflow-x: auto;
`;

export const IdeEditorTab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.75rem;
  border: none;
  border-bottom: 2px solid
    ${({ active, theme }) => (active ? theme.violet : 'transparent')};
  background: ${({ active, theme }) => (active ? theme.white : 'transparent')};
  color: ${({ active, theme }) => (active ? theme.black : theme.gray800)};
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.white : theme.black10};
  }
`;

export const FileTab = styled.button<{ selected: boolean }>`
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  border: 1px solid
    ${({ selected, theme }) => (selected ? theme.violet : theme.black20)};
  background: ${({ selected, theme }) =>
    selected ? theme.violet : theme.white};
  color: ${({ selected, theme }) =>
    selected ? theme.true.white : theme.black};
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: ${({ selected }) => (selected ? 600 : 400)};
`;

export const FileTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const SourceSection = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SourceToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const SelectorGroup = styled.div<{ pushRight?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  ${({ pushRight }) => pushRight && 'margin-left: auto;'}
`;

export const SelectorLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.black};
`;

const FadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
  user-select: none;
`;

export const DropdownTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.black20};
  background: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.black};
  font-size: 0.875rem;
  cursor: pointer;
  outline: none;
  min-width: 80px;

  &:focus {
    border-color: ${({ theme }) => theme.violet};
  }

  &::after {
    content: '▾';
    font-size: 0.7rem;
  }
`;

export const DropdownMenu = styled.div<{ active: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 100%;
  padding: 0.35rem;
  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.black20};
  border-radius: 8px;
  display: none;
  flex-direction: column;
  gap: 0.15rem;
  z-index: 10;
  animation: ${FadeIn} 0.1s ease-in-out;
  box-shadow: 0 4px 12px ${({ theme }) => theme.true.black10};

  ${({ active }) =>
    active &&
    css`
      display: flex;
    `};
`;

export const DropdownItem = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  background: ${({ selected, theme }) =>
    selected ? theme.violet : 'transparent'};
  color: ${({ selected, theme }) =>
    selected ? theme.true.white : theme.black};
  font-size: 0.8rem;
  font-weight: ${({ selected }) => (selected ? 600 : 400)};
  cursor: pointer;
  white-space: nowrap;
  width: 100%;
  text-align: left;

  &:hover {
    background: ${({ selected, theme }) =>
      selected ? theme.violet : theme.black20};
  }
`;

export const VersionSelector = styled.select`
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.black20};
  background: transparent;
  color: ${({ theme }) => theme.black};
  font-size: 0.875rem;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.violet};
  }
`;

export const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  opacity: 0.6;
  font-size: 0.9rem;
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
