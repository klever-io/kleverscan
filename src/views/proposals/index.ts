import { default as DefaultInput } from '@/components/InputGlobal';
import styled from 'styled-components';

export const Header = styled.section`
  margin-bottom: 1rem;

  display: flex;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

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
`;

export const ProgressContent = styled.div`
  margin-left: 0.6rem;
  margin-top: 0.6rem;
  height: 0.3rem;
  width: 70%;

  position: relative;

  background-color: ${props => props.theme.background};

  border-radius: 0.25rem;
`;
export const CardContainer = styled.section`
  margin: 1.5rem 0;

  display: flex;

  flex-direction: row;

  gap: 0.75rem;
  font-family: Rubik;
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;

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
