import styled, { css } from 'styled-components';

interface ToolbarButtonProps {
  active: boolean;
}

export const ToolbarStyle = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;

  padding: 8px;
  align-items: center;
  justify-content: space-between;

  background-color: transparent;

  border-bottom: 1px solid
    ${({ theme }) => (theme.dark ? theme.true.white : theme.black)};

  min-width: 100%;
  max-width: 100%;
`;

export const ToolbarButton = styled.button<ToolbarButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 2px;
  color: ${({ theme }) => (theme.dark ? theme.true.white : theme.black)};

  @media (min-width: 321px) and (max-width: 768px) {
    padding: 3px;
  }

  @media (min-width: 769px) {
    padding: 5px;
  }

  &:hover {
    filter: brightness(1.2);
    backdrop-filter: brightness(1.2);
  }

  background-color: ${props =>
    props.active ? props.theme.violet : 'transparent'};
`;
export const Icon = styled.div`
  @media (max-width: 320px) {
    width: 14px;
    height: 14px;
  }

  @media (min-width: 321px) and (max-width: 768px) {
    width: 16px;
    height: 16px;
  }

  @media (min-width: 769px) {
    width: 20px;
    height: 20px;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;
