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