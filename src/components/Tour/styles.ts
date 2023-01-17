import { transparentize } from 'polished';
import styled, { css } from 'styled-components';

interface IPlacement {
  contentWidth: number;
  contentHeight: number;
  position?: {
    left: number;
    top: number;
    bottom: number;
    right: number;
  };
}

export const TourContainer = styled.div<IPlacement>`
  position: absolute;
  top: ${props => props.position?.top || 0}px;
  left: ${props => props.position?.left || 0}px;
  z-index: 2000;
  border-radius: 0.5rem;
  width: ${props => props.contentWidth}px;
  height: ${props => props.contentHeight}px;
`;

export const PlacementReference = styled.div<{ isVisibile: boolean }>`
  all: inherit;

  ${props =>
    props.isVisibile
      ? css`
          visibility: visible;
          opacity: 1;
        `
      : css`
          visibility: hidden;
          opacity: 0;
        `}
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
  position: relative;
  width: fit-content;
  z-index: 200000 !important;

  isolation: isolate;
`;

export const TourBackground = styled.div<{ isOpen?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background-color: ${props => transparentize(0.2, props.theme.true.black)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  opacity: ${props => (props.isOpen ? 1 : 0)};
  transition: all 0.1s linear;
  z-index: 1;
`;

export const TourTooltip = styled.div<IPlacement>`
  position: fixed;
  top: calc(${props => props.position?.bottom || 0}px + 1rem);
  left: ${props => props.position?.left || 0}px;
  transform: translateX(
    calc(-1 * (100% - ${props => props.contentWidth}px) / 2)
  );
  z-index: 1000;

  width: 12rem;
  padding: 0.8rem;

  border-radius: 5%;
  text-align: center;

  background: ${props => props.theme.true.white};
  color: ${props => props.theme.purple};

  user-select: none;

  ::before {
    content: '';

    position: absolute;

    width: 1rem;
    height: 1rem;
    border-width: 1rem 1rem 1rem 1rem;
    border-style: solid;
    border-color: #fafafa;

    z-index: -1;

    display: block;
    box-sizing: border-box;
    left: 50%;
    top: -0.5rem;
    transform: translateX(-50%) rotate(-45deg);
  }
`;

export const DismissButton = styled.div`
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateY(100%) translateX(-50%);

  padding: 0.25rem 1rem 0.25rem 0.2rem;

  font-size: 0.9rem;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;

  cursor: pointer;

  color: ${props => props.theme.lightGray};

  border-bottom: 1px solid ${props => props.theme.lightGray};

  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.true.white};
    border-bottom: 1px solid ${props => props.theme.true.white};
  }
`;
