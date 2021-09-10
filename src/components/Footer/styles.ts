import { darken } from 'polished';
import styled from 'styled-components';

export const Container = styled.footer`
  padding: 1rem 17.5rem;

  background-color: ${props => props.theme.navbar.background};

  font-weight: 300;

  a {
    text-decoration: unset;
    color: ${props => props.theme.white};
    line-height: 2rem;

    transition: 0.2s ease;

    &:hover {
      color: ${props => darken(0.15, props.theme.white)};
    }
  }

  @media (max-width: 1200px) {
    padding: 1rem 7rem;
  }

  @media (max-width: 992px) {
    padding: 1rem 2.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
`;

export const SectionContainer = styled.div`
  padding: 4.5rem 0 1.5rem 0;

  display: flex;

  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;

    align-items: center;
  }
`;

export const Content = styled.div`
  display: flex;
  flex: 25%;

  flex-direction: column;

  span {
    margin-bottom: 1.5rem;

    color: ${props => props.theme.navbar.mobile};
    text-transform: uppercase;
    letter-spacing: 0.25rem;
    font-size: 0.85rem;

    strong {
      font-weight: 500;
    }

    @media (max-width: 768px) {
      font-size: 0.975rem;
    }
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    margin: 1.5rem 0;

    align-items: center;
  }
`;

export const CreditsContainer = styled.div`
  padding: 2rem 0;

  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  span {
    font-size: 0.875rem;
    color: ${props => props.theme.navbar.mobile};
    line-height: 1.5rem;
  }
`;
