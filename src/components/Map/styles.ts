import { transparentize } from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  user-select: none;

  .leaflet-container {
    width: 100%;
    height: 280px;

    overflow: hidden;

    background-color: #1a1a1a;

    border-radius: 0.5rem;
  }

  .map-marker {
    border: 1px solid ${props => props.theme.lightPurple};

    background-color: ${props => props.theme.purple};
    box-shadow: 0 0 8px 2px ${props => transparentize(0.4, props.theme.purple)};

    border-radius: 50%;

    pointer-events: none;
    cursor: unset;
  }

  .leaflet-container.leaflet-touch-drag {
    touch-action: pan-y;
  }

  .map-network {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    overflow: visible;
    pointer-events: none;
  }

  .map-link {
    fill: none;
    stroke: ${props => props.theme.purple};
    stroke-width: 1.5;
    stroke-opacity: 0.8;
    stroke-linecap: round;
    stroke-dasharray: 4 6;
    animation: map-link-flow 1.2s linear infinite;
  }

  .map-link-halo {
    fill: ${props => props.theme.purple};
    fill-opacity: 0.35;
  }

  .map-link-dot {
    fill: ${props => props.theme.lightPurple};
  }

  @keyframes map-link-flow {
    from {
      stroke-dashoffset: 10;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .map-link {
      animation: none;
    }

    .map-link-traveler {
      display: none;
    }
  }

  .leaflet-control-container {
    display: none;
  }

  .leaflet-pane {
    z-index: 1;
  }
`;

export const Row = styled.div`
  width: 100%;

  padding: 0.7rem 2rem;

  display: flex;

  flex-direction: row;
  align-items: center;

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.card.border};

    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  span {
    font-size: 0.9rem;

    width: 10rem;

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      max-width: 100%;
    }

    overflow: hidden;

    text-overflow: ellipsis;
    white-space: nowrap;

    strong {
      font-weight: 600;
      font-size: 0.95rem;
      color: ${props => props.theme.darkText};
    }

    small {
      font-weight: 400;
      font-size: 0.95rem;
      color: ${props => props.theme.darkText};
    }

    a {
      color: ${props => props.theme.black};
      font-size: 0.95rem;
      font-weight: 600;
    }

    p {
      color: ${props => props.theme.darkText};
      font-weight: 400;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
