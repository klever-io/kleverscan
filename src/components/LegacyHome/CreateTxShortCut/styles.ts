import { darken, lighten, transparentize } from 'polished';
import styled, { css, keyframes } from 'styled-components';

const animatedDropdown = keyframes`
  0% {
    transform: scaleY(0.8);
    transform-origin: 0 0;

    opacity: 0;
    visibility: hidden;
  }

   to {
    transform: scaleY(1);
    transform-origin: 0 0;

    opacity: 1;
    visibility: visible;
  }

`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.36rem;
  position: absolute;

  left: 0;
  right: 0;
  width: 100%;

  height: 4rem;
  margin-top: 1rem;
  color: ${props => props.theme.black};
  background-color: ${props => transparentize(0.1, props.theme.white)};

  backdrop-filter: blur(5px);
  border-bottom: 1px solid ${props => lighten(0.02, props.theme.white)};

  transition: 1000ms ease;
  z-index: -1;

  > div {
    display: flex;
    width: 100%;
    @media (min-width: 768px) {
      align-items: center;
    }
  }

  svg {
    font-size: 1.5rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    overflow: hidden;
    justify-content: center;
    gap: 0;
    padding: 0;
  }
`;

export const InteractionButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  max-width: 1900px;
  padding: 0 min(5vw, 2rem);

  > button {
    align-self: unset;
    background-color: ${props =>
      transparentize(
        0.3,
        props.theme.dark
          ? lighten(0.08, props.theme.white)
          : darken(0.05, props.theme.white),
      )};
    min-width: unset;
    max-width: unset;

    width: fit-content;

    justify-content: flex-start;

    svg {
      path {
        fill: ${props => props.theme.lightBlue};
      }
    }

    span {
      color: ${props => props.theme.black} !important;
    }
  }
`;

export const CreateTxHeader = styled.div`
  justify-content: space-between;
`;

export const ShortCutDropdown = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  padding: 2rem 1.5rem;

  position: absolute;
  top: 4rem;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;

  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  opacity: ${props => (props.isOpen ? 1 : 0)};
  background-color: ${props => transparentize(0.1, props.theme.white)};
  backdrop-filter: blur(5px);

  font-weight: 700;

  > button {
    align-self: unset;
    background-color: unset;
    width: fit-content;

    background-color: rgba(255, 255, 255, 0.1);

    padding: 2rem 2rem;

    justify-content: flex-start;
    text-align: start;

    svg {
      path {
        fill: ${props => props.theme.lightBlue};
      }
    }

    span {
      color: ${props => props.theme.black} !important;
    }
  }

  ${props =>
    props.isOpen &&
    css`
      animation: ${animatedDropdown} 0.3s ease;
    `}
`;

export const Button = styled.button<{ isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.black};
  background: ${props => props.theme.violet};

  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: 700;
  ${props =>
    props.isMobile &&
    css`
      padding: 1.5rem 1rem;
    `}

  &:hover {
    background: ${props => props.theme.violet};
    filter: brightness(1.2);
  }

  &:last-child {
    margin-right: 3rem;
  }
`;
