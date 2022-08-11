import styled, { css } from 'styled-components';

export const ToggleButtonContainer = styled.div<{ active: boolean }>`
  display: inline-block;
  position: relative;
  display: flex;
  align-items: center;
  width: 45px;
  height: 1.4rem;
  background-color: ${props =>
    props.active ? props.theme.purple : props.theme.borderLogo};
  border-radius: 34px;
  user-select: none;
`;

export const ToggleButtonIcon = styled.button<{
  active: boolean;
  hasIcon: boolean;
}>`
  height: 1.1rem;
  width: 17px;
  position: relative;
  left: 3px;
  background-color: ${props => props.theme.white};
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 100%;
  color: ${props => props.theme.gray};
  ${props =>
    props.active &&
    css`
      transform: translateX(22px);
    `}
  ${props =>
    props.hasIcon &&
    css`
      background-color: transparent;
    `}
`;
