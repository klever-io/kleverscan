import styled from 'styled-components';

export const Main = styled.main`
  padding: 3rem min(5vw, 10rem) 5rem;
  display: block;
  margin: 0 auto;
  max-width: ${props => props.theme.maxWidth};
  background-color: ${props => props.theme.legacy.background};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 3rem 1rem 5rem;
  }
`;

export const LayoutContainer = styled.div`
  margin: auto;
  background-color: ${props => props.theme.legacy.background};

  position: relative;
`;
