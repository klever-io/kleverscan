import { transparentize } from 'polished';
import styled from 'styled-components';

export const Container = styled.div<{ openModal?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  display: ${props => (props.openModal ? 'grid' : 'none')};
  place-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  backdrop-filter: brightness(0.3);
  visibility: ${props => (props.openModal ? 'visible' : 'hidden')};
`;

export const Content = styled.div`
  touch-action: manipulation;
  position: relative;
  max-height: 50rem;
  overflow: auto;
  overflow-x: hidden;
  padding: 2rem;
  max-width: 95vw;
  min-width: 60vw;
  border-radius: 1rem;
  background-color: ${props => props.theme.modalBackground.background};
  h1 {
    color: ${props => props.theme.true.white};
  }

  &::-webkit-scrollbar {
    position: absolute;
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 1rem;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${props => transparentize(0.75, props.theme.black)};
    }
  }
`;

export const TitleContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
  h1 {
    color: ${({ theme }) => theme.modalBackground.title};
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      max-width: 20rem;
    }
  }

  svg {
    color: ${({ theme }) => theme.black};
    position: absolute;
    float: right;
    right: 4rem;
    width: 1.3rem;
    height: 1.3rem;

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      right: 2rem;
    }
  }
`;
