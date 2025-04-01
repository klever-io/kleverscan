import { TickSquare } from '@/assets/icons';
import styled, { css } from 'styled-components';

export const OperationsContainer = styled.div`
  display: flex;
  position: relative;
  padding: 0rem !important;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column !important;
    align-items: flex-start !important;
  }
  flex-wrap: wrap;
  gap: 1rem;
`;

export const OperationsContent = styled.div<{ isChecked?: boolean }>`
  gap: 0.5rem;
  width: 16rem;
  border: none !important;
  padding: 0 !important;
  p {
    opacity: ${({ isChecked }) => !isChecked && 0.5};
  }
`;

export const CheckboxOperations = styled.input`
  height: 1rem;
  width: 1rem;
  background: none;
  -webkit-appearance: none;
  border-radius: 0.2rem;

  &::before {
    content: ${({ checked }) => (checked ? "''" : "'\\2715'")};
    color: ${({ checked, theme }) =>
      checked ? 'transparent' : theme.true.white};
    display: flex;
    align-items: center;
    justify-content: center;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    border: 0;
    background-color: ${({ checked, theme }) =>
      checked ? theme.green : theme.line.border};
    opacity: ${({ checked }) => (checked ? 1 : 0.5)};
    background-size: contain;
    box-shadow: none;
  }
`;

export const ButtonExpand = styled.button`
  position: absolute;
  padding: 0.7rem;
  width: 6rem;
  top: 0;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    top: -3rem;
  }
  right: 0;
  border-radius: 0.5rem;
  background-color: ${props => props.theme.purple};
  color: ${props => props.theme.true.white};
`;

export const ValidOperation = styled(TickSquare).attrs(() => ({
  size: 10,
}))`
  path {
    fill: ${({ theme }) => theme.green};
  }
`;
