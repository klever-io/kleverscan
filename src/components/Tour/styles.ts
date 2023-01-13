import { transparentize } from 'polished';
import styled from 'styled-components';

export const TourContainer = styled.div`
  position: relative;
  z-index: 2000;
  border-radius: 0.5rem;
  width: 100%;
  height: 100%;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;
export const ContainerAttention = styled.div`
  animation: animate 2s ease-in-out infinite;
  @keyframes animate {
    0% {
      filter: brightness(0.7);
    }
    50% {
      filter: brightness(1.3);
    }
    100% {
      filter: brightness(0.7);
    }
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    background: ${props => props.theme.violet};
    border-radius: 10%;
  }
`;
export const TourContent = styled.div`
  width: fit-content;
`;

export const TourBackground = styled.div<{ isOpen?: boolean }>`
  position: fixed;
  top: 4.6rem;
  left: 0;
  width: 100%;
  height: 100%;

  background-color: ${props => transparentize(0.2, props.theme.true.black)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  opacity: ${props => (props.isOpen ? 1 : 0)};
  transition: all 0.1s linear;
  z-index: 100 !important;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    top: 5.8rem;
  }

  @media (max-width: 804px) {
    top: 8rem;
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    top: 4.5rem;
  }
`;

export const BackgroundBlockNavigation = styled.div<{ isOpen?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 75%;
  height: 4.5rem;

  background-color: ${props => transparentize(1, props.theme.true.black)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  opacity: ${props => (props.isOpen ? 1 : 0)};
  transition: all 0.1s linear;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 67%;
    height: 6.5rem;
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 64%;
    height: 4.5rem;
  }
`;

export const BackgroundBlockMobileBar = styled.div<{ isOpen?: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 6rem;
  height: 4.5rem;
  background-color: ${props => transparentize(1, props.theme.true.black)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  opacity: ${props => (props.isOpen ? 1 : 0)};
  transition: all 0.1s linear;
  z-index: 100 !important;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    position: fixed;
    top: 0;
    right: 0;
    width: 6rem;
    height: 5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    position: fixed;
    top: 0;
    right: 0;
    width: 4rem;
    height: 4rem;
  }
`;

export const TourTooltip = styled.div<{ width: number }>`
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 12rem;
  transform: translateY(100%)
    translateX(calc(-1 * (100% - ${props => props.width}px) / 2));
  padding: 0.8rem;
  border-radius: 5%;
  text-align: center;
  background: ${props => props.theme.true.white};
  color: ${props => props.theme.purple};
  z-index: 1000;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    position: fixed;
    right: unset;
    bottom: unset;
    left: unset;
    top: -4rem;
    right: -2rem;
    width: 10rem;
  }
`;

export const Arrow = styled.div`
  box-sizing: border-box;
  position: absolute;
  left: 3.5rem;
  top: 3rem;
  transform: rotate(-45deg);
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    top: 3.2rem;
    left: 0.4rem;
  }
  &::before {
    content: '';
    width: 100%;
    height: 100%;
    border-width: 1rem 1rem 1rem 0;
    border-style: solid;
    border-color: #fafafa;

    display: block;
  }
`;
