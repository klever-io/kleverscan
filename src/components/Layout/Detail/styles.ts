import { default as DefaultInput } from '@/components/Inputt';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 3rem 10rem 5rem 10rem;

  background-color: ${props => props.theme.background};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 3rem 1rem 5rem 1rem;
  }
`;

export const Header = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
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

  border-color: ${props => props.theme.lightGray};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

export const CardContainer = styled.section`
  margin: 1.5rem 0;

  display: flex;

  flex-direction: row;

  gap: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
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

    strong {
      font-weight: 600;
    }

    p {
      opacity: 0.4;

      font-size: 0.85rem;
      font-weight: 400;
      color: ${props => props.theme.darkText};
    }

    small {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${props => props.theme.darkText};
    }
  }
`;

export const TableContainer = styled.section`
  display: flex;

  flex-direction: column;

  gap: 1.5rem;
`;
