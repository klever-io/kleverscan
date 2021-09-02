import { transparentize } from 'polished';
import styled, { css } from 'styled-components';

import { IButton } from '.';

export const Container = styled.div<IButton>`
  padding: 1rem 1.25rem;

  position: relative;

  background-color: ${props => !props.mainPage && props.theme.white};
  background-image: ${props => props.mainPage && props.theme.button.background};

  border: 1px solid
    ${props => (props.mainPage ? 'transparent' : props.theme.rose)};
  border-radius: ${props => (props.mainPage ? 0.5 : 0.25)}rem;

  font-size: 0.8rem;
  text-transform: uppercase;

  cursor: pointer;

  transition: 0.3s ease;

  p {
    position: relative;

    color: transparent;
    background-image: ${props => props.theme.button.background};
    background-clip: text;
    -webkit-background-clip: text;

    z-index: 2;

    transition: 0.3s ease;
  }

  &:before {
    content: '';

    position: absolute;
    inset: 0;

    display: block;

    background-image: ${props => props.theme.button.background};
    opacity: 0;

    border-radius: 0.25rem;

    transition: 0.3s ease;
  }

  &:hover {
    ${props =>
      !props.mainPage
        ? css`
            border-color: transparent;

            background-color: ${transparentize(0, props.theme.white)};

            &:before {
              opacity: 1;
            }

            p {
              color: ${props.theme.white};
            }
          `
        : css`
            filter: brightness(1.1);
          `};
  }
`;
