import { transparentize } from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  user-select: none;
  pointer-events: none;

  .leaflet-container {
    width: 100%;
    height: 200px;

    overflow: hidden;

    background-color: ${props => props.theme.white};

    border-radius: 0.5rem;
  }

  .map-marker {
    width: 8px !important;
    height: 8px !important;
    border: 1px solid ${props => props.theme.gray800};

    background-color: ${props => transparentize(0.25, props.theme.gray700)};

    border-radius: 50%;
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
