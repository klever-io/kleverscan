import { DefaultCardStyles } from '@/styles/common';
import styled, { css } from 'styled-components';

export const Container = styled.div<{ isInHomePage: boolean }>`
  ${DefaultCardStyles}
  position: relative;
  padding: 0.75rem 1rem;
  display: flex;
  width: 100%;
  min-width: 11rem;
  max-width: 20rem;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  border-radius: 24px;
  mix-blend-mode: normal;
  cursor: text;

  border: 1px solid
    ${props => (props.theme.dark ? props.theme.lightGray : props.theme.black10)};

  ${props =>
    props.isInHomePage &&
    css`
      max-width: initial;
      width: 100%;
    `}

  transition: 0.2s ease;
  input {
    width: 100%;
    min-width: 5rem;

    color: ${props =>
      props.theme.dark
        ? props.theme.lightGray
        : props.theme.gray800} !important;

    &::placeholder {
      color: ${props =>
        props.theme.dark ? props.theme.lightGray : props.theme.gray800};
    }

    &::selection {
      background-color: ${props => props.theme.darkText};
    }

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      min-width: 0;
    }
  }

  svg {
    cursor: pointer;
    path {
      fill: ${props =>
        props.theme.dark ? props.theme.lightGray : props.theme.gray800};
    }
  }
`;

export const FocusBackground = styled.div`
  position: fixed;
  z-index: 6;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
`;
