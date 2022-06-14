import styled from 'styled-components';

import { default as DefaultInput } from '@/components/Inputt';

export const Container = styled.div`
  padding: 3rem 10rem 5rem 10rem;

  background-color: ${props => props.theme.background};

  @media (max-width: 890px) {
    padding: 3rem 3rem 5rem 3rem;
  }
`;

export const Header = styled.section`
  display: flex;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 870px) {
    flex-direction: column;

    align-items: flex-start;
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

export const Input = styled(DefaultInput)`
  margin-top: 1.1rem;

  padding: 0.75rem 1rem;

  background-color: ${props => props.theme.white};

  border-color: ${props => props.theme.filter.border};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const CardContainer = styled.section`
  margin: 1.5rem 0;

  display: flex;

  flex-direction: row;

  gap: 0.75rem;

  @media (max-width: 870px) {
    flex-direction: column;
  }
`;

export const Card = styled.div`
  width: 100%;
  padding: 1.5rem;
  overflow: hidden;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  background-color: ${props => props.theme.white};

  border-radius: 1rem;

  gap: 1rem;


  div {
    display: flex;

    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    span:nth-child(2) {
      text-align: right;
    }
    p:nth-child(2) {
      text-align: right;
    }
    
    strong {
      font-weight: 600;
    }

    p {
      opacity: 0.4;

      font-size: 0.85rem;
      font-weight: 400;
      color: ${props => props.theme.card.darkText};
    }

    small {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${props => props.theme.card.darkText};
    }
  }
`;

export const TableContainer = styled.section`
  display: flex;

  flex-direction: column;

  gap: 1.5rem;
`;
