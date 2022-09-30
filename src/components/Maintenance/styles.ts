import styled from 'styled-components';

export const Container = styled.div`
  color: ${props => props.theme.white};
  margin-bottom: 2.5rem;
  padding: 1.5rem 0;
  svg {
    font-size: 2.75rem;
    transform: scaleX(-1);
  }
  span {
    font-size: 1.25rem;
  }
  p {
    font-size: 1.5rem;
    font-weight: bold;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    svg {
      font-size: 2rem;
    }
    span {
      font-size: 0.9rem;
    }
    p {
      font-size: 1rem;
      font-weight: bold;
    }
  }
`;
