import { default as DefaultInput } from '@/components/Inputt';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 3rem 8rem 5rem 8rem;

  background-color: ${props => props.theme.background};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 3rem 1rem 5rem 1rem;
  }
`;

export const Header = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

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

export const OverviewContainer = styled.div`
  margin: 1.25rem 0;

  background-color: ${props => props.theme.white};

  border-radius: 0.75rem;
`;

export const Row = styled.div`
  width: 100%;

  padding: 1.5rem 2rem;

  display: flex;

  flex-direction: row;
  align-items: center;

  color: ${props => props.theme.black};

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.card.border};

    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  span {
    &:first-child {
      width: 10rem;
    }

    /* overflow: hidden; */

    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    flex-direction: column;

    strong {
      font-weight: 600;
      color: ${props => props.theme.darkText};
    }

    small {
      font-weight: 400;
      font-size: 0.95rem;
      color: ${props => props.theme.darkText};
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const RowContent = styled.span`
  width: 100%;
`;

export const CenteredRow = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;
  flex: 1;

  gap: 0.5rem;

  width: 100%;

  span {
    flex: 1;

    font-weight: 600 !important;
    font-size: 0.85rem !important;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: fit-content;
  }

  svg {
    cursor: pointer;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

export const BalanceContainer = styled.div`
  display: flex;

  flex-direction: column;
`;

export const AmountContainer = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;
  gap: 1.5rem;

  div {
    span {
      font-weight: 600;
      margin-top: 0.2rem;
    }

    p {
      font-weight: 400;
      font-size: 0.85rem;
      color: ${props => props.theme.darkText};
      margin-top: 0.2rem;
      margin-bottom: 0.2rem;
    }
  }
`;

export const IconContainer = styled.div`
  display: flex;

  flex-direction: row !important;
  align-items: center;

  gap: 0.5rem;

  span {
    font-weight: 600;
  }
`;

export const FrozenContainer = styled.div`
  margin-top: 0.5rem;

  width: 100%;

  display: flex;

  flex-direction: column;

  background-color: ${props => props.theme.accountCard.frozenBackground};

  border-radius: 0.75rem;

  div {
    padding: 1.25rem 2rem;

    display: flex;

    flex-direction: row;
    align-items: center;

    &:not(:last-child) {
      border-bottom: 1px solid ${props => props.theme.card.border};

      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }

    strong {
      width: 10rem;

      font-weight: 600;
      color: ${props => props.theme.darkText};
    }

    span {
      color: ${props => props.theme.darkText};
    }
  }
`;

export const HalfRow = styled.div`
  display: flex;
  overflow: hidden;
  align-items: center;
  width: 50%;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.1rem;
    width: 100%;
  }
`;
