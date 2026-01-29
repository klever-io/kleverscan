import styled from 'styled-components';
import { IoMdArrowDropdown } from 'react-icons/io';

export const ActionsDropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const ActionsDropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.violet};
  color: ${props => props.theme.true.white};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.2);
  }

  svg {
    transition: transform 0.2s ease;
  }
`;

export const DropdownIcon = styled(IoMdArrowDropdown)<{ $isOpen: boolean }>`
  transform: rotate(${props => (props.$isOpen ? '180deg' : '0deg')});
  transition: transform 0.2s ease;
`;

export const ActionsDropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 150px;
  background-color: ${props => props.theme.dropdown.background};
  border: 1px solid ${props => props.theme.card.border};
  border-radius: 0.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 10;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  overflow: hidden;
`;

export const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: ${props => props.theme.black};
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.white};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.card.border};
  }
`;
