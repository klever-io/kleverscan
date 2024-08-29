import { BsMoon, BsSun } from 'react-icons/bs';
import styled, { css } from 'styled-components';

export const MoonIcon = styled(BsMoon)`
  position: relative;
  width: 18px;
  height: 18px;
  z-index: 2;
  right: 3px;
  ${props =>
    props.theme.dark &&
    css`
      color: #151515;
      background-color: ${props => props.theme.true.white};
      border-radius: 50%;
    `}

  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    right: 3px;
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    left: 1px;
    width: initial;
    height: initial;
  }
`;

export const SunIcon = styled(BsSun)`
  position: relative;
  width: 19.5px;
  height: 19.5px;
  z-index: 2;
  right: 18.5px;
  ${props =>
    !props.theme.dark &&
    css`
      color: #151515;
      background-color: ${props => props.theme.true.white};
      border-radius: 50%;
    `}

  @media  (min-width: ${props => props.theme.breakpoints.mobile}) {
    right: 22px;
    top: 1px;
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    right: 1px;
    width: initial;
    height: initial;
  }
`;

export const Container = styled.div<{ isConnected: boolean | null }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  user-select: none;
`;

export const IconContainer = styled.div`
  position: relative;
  z-index: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 5.55rem;
  height: 2.55rem;
  background-color: ${props => props.theme.card.gray};
  border-radius: 2rem;
  cursor: pointer;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    width: 3.7rem;
    height: 1.7rem;
  }
`;

export const SelectedMode = styled.div`
  position: absolute;
  z-index: 1;
  background-color: ${props => props.theme.true.white};
  border-radius: 50%;
  width: 2.1rem;
  height: 2.1rem;
  transition: transform 500ms;
  transform: translateX(-105%);
  ${props =>
    props.theme.dark &&
    css`
      transform: translateX(30%);
    `}

  box-shadow: 0px 2px 3px gray;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    width: 1.5rem;
    height: 1.5rem;
    transform: translateX(-55%);
    ${props =>
      props.theme.dark &&
      css`
        transform: translateX(57%);
      `}
  }
`;

export const LanguageContainer = styled.div`
  height: 1rem;

  font-weight: 400;

  color: ${props => props.theme.navbar.text};

  cursor: pointer;
`;
