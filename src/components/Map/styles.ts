import styled from 'styled-components'

import { transparentize } from 'polished';

export const Container = styled.div`
  .leaflet-container {
    width: 100%;
    height: 30rem;
    
    overflow: hidden;

    background-color: ${props => props.theme.white};

    border-radius: .5rem;
  }

  .map-marker{
    width: 0.75rem;
    height: 0.75rem;
    
    background-color: ${props => transparentize(.25, props.theme.map.marker)};

    border-radius: 50%;
  }

  .map-cluster {
    margin: -1.975rem 0 0 -1.975rem !important;
    padding: 1.975rem;

    display: flex;

    z-index: 1000 !important;

    align-items: center;
    justify-content: center;

    background-image: ${props => props.theme.text.background};
    
    border-radius: 50%;

    font-size: .975rem;
    font-weight: 500;
    text-align: right;
    color: ${props => props.theme.white};

    box-shadow: inset 0 0 0 .437rem ${props => transparentize(.5, props.theme.white)};
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

    @media (max-width: 768px) {
      max-width: 100%;
    }

    overflow: hidden;

    text-overflow: ellipsis;
    white-space: nowrap;

    strong {
      font-weight: 600;
      font-size: 0.95rem;
      color: ${props => props.theme.card.darkText};
    }

    small {
      font-weight: 400;
      font-size: 0.95rem;
      color: ${props => props.theme.card.darkText};
    }

    a {
      color: ${props => props.theme.black};
      font-size: 0.95rem;
      font-weight: 600;
    }

    p {
      color: ${props => props.theme.card.darkText};
      font-weight: 400;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;