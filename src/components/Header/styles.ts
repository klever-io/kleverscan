import styled, { css } from 'styled-components';

import LogoSvg from '../../assets/new-logo.svg';

import { default as DefaultInput } from '../Inputt';

export const Container = styled.div`
  padding: 1rem 5rem;

  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 1.5rem;

  background-color: ${props => props.theme.navbar.background};
`;

export const Logo = styled(LogoSvg)`
  margin-right: 0.5rem;

  cursor: pointer;
`;

export const Item = styled.div<{ selected: boolean }>`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 0.5rem;

  cursor: pointer;

  transition: 0.2s ease;

  filter: brightness(${props => (props.selected ? 10 : 1)});

  &:hover {
    ${props =>
      !props.selected &&
      css`
        filter: brightness(1.5);
      `};
  }

  span {
    color: ${props => props.theme.navbar.text};
    font-weight: 600;
  }
`;

export const Input = styled(DefaultInput)`
  margin-left: auto;

  border-color: ${props => props.theme.input.border.dark};
`;
