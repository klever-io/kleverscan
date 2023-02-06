import { default as DefaultInput } from '@/components/InputGlobal';
import styled from 'styled-components';

export const Container = styled.div``;

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

  > span {
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

export const ButtonModal = styled.button<{
  isAssetTrigger?: boolean;
  isLocked?: boolean;
}>`
  color: ${props => props.theme.true.white};
  background-color: ${props => props.theme.violet};
  height: 2.5rem;
  align-self: end;
  min-width: ${props => (props.isAssetTrigger ? '11rem' : '13rem')};
  max-width: 14.6rem;
  padding: 0 2rem;
  border-radius: 4px;
  :active {
    transform: ${props => (props.isLocked ? '' : 'translateY(0.1rem)')};
  }
  :hover {
    opacity: ${props => (props.isLocked ? '' : '0.8')};
  }
  opacity: ${props => (props.isLocked ? '0.3' : '1')};
  cursor: ${props => (props.isLocked ? 'not-allowed' : 'pointer')};
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const ContainerTabInteractions = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

export const CenteredRow = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;
  flex: 1;

  gap: 0.5rem;

  width: 100%;

  > span {
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

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
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
    }

    p {
      font-weight: 400;
      font-size: 0.85rem;
      color: ${props => props.theme.darkText};
      margin-top: 0.2rem;
      margin-bottom: 0.2rem;
    }
  }
  div:nth-child(2) {
    display: flex;
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      width: auto;
      flex-direction: column;
      gap: 0.5rem;
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
      margin-right: 5px;
      font-weight: 600;
      color: ${props => props.theme.darkText};
    }

    span {
      color: ${props => props.theme.darkText};
      padding-right: 1rem;
      min-width: 10rem;
    }
  }
`;

export const StakingRewards = styled.div`
  display: flex;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    button {
      margin-top: 0.7rem;
    }
    flex-wrap: wrap;
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

export const AccountSkeletonContainer = styled.div`
  min-width: 10rem;
  width: 100%;
  max-width: 30rem;
`;
