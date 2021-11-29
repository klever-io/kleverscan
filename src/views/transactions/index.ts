import styled from 'styled-components';

import { default as DefaultInput } from '@/components/Inputt';

export const Container = styled.div`
  padding: 3rem 10rem 5rem 10rem;

  background-color: ${props => props.theme.background};

  @media (max-width: 768px) {
    padding: 3rem 3rem 5rem 3rem;
  }
`;

export const Title = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 0.75rem;

  div {
    cursor: pointer;

    svg {
      height: auto;
      width: auto;
    }
  }
`;

export const Header = styled.section`
  margin: 1.5rem 0;

  display: flex;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FilterContainer = styled.div`
  display: flex;

  flex-direction: row;

  gap: 0.75rem;

  @media (max-width: 768px) {
    width: 100%;

    flex-direction: column;
  }
`;

export const Input = styled(DefaultInput)`
  margin-top: 1.1rem;

  padding: 0.75rem 1rem;

  background-color: ${props => props.theme.white};

  border-color: ${props => props.theme.filter.border};
`;

export const CenteredRow = styled.span`
  div {
    display: flex;

    flex-direction: row;
    align-items: center;

    gap: 0.5rem;

    p {
      font-weight: 600;
      color: ${props => props.theme.black};
    }
  }
`;
