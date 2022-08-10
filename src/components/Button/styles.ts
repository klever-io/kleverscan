import { transparentize } from 'polished';
import styled, { css } from 'styled-components';
import { IButton } from '.';

const ContainerMainPage = css`
  background-color: unset;
  background-image: ${props => props.theme.button.background};

  border: unset;
  border-radius: 0.5rem;
`;

export const Container = styled.button<IButton>`
  padding: 1rem 1.25rem;

  position: relative;

  background-color: ${props => props.theme.white};

  border: 1px solid ${props => props.theme.rose};
  border-radius: 0.25rem;

  color: ${props => props.theme.white};
  font-size: 0.8rem;
  text-transform: uppercase;

  cursor: pointer;

  transition: 0.3s ease;

  ${props => props.mainPage && ContainerMainPage};

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
