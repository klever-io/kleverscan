import { TickSquare } from '@/assets/icons';
import { default as DefaultInput } from '@/components/InputGlobal';
import styled, { css } from 'styled-components';

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

export const Row = styled.div<{ isAddressRow?: boolean }>`
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
    ${props =>
      props.isAddressRow &&
      css`
        flex-direction: row;
        align-items: center;
      `}
  }
`;

export const RowContent = styled.span`
  width: 100%;
`;

export const ButtonModal = styled.button<{
  isLocked?: boolean;
}>`
  color: ${props => props.theme.true.white};
  background-color: ${props => props.theme.violet};
  height: 2.5rem;

  align-self: end;

  min-width: 13rem;
  max-width: 15rem;

  padding: 0 1rem;
  border-radius: 4px;

  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  > span {
    color: ${props => props.theme.true.white} !important;
  }

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
    max-width: 100%;
  }
`;

export const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  > span {
    flex: 1;

    font-weight: 600 !important;
    font-size: 0.85rem !important;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: fit-content;
  }
`;

export const ContainerTabInteractions = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

export const CenteredRow = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  gap: 0.5rem;

  width: 100%;

  svg {
    cursor: pointer;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    flex-wrap: wrap;
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
    div {
      padding-right: 5rem;
    }
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

export const CardHeader = styled.div`
  display: flex;

  flex-direction: row;
`;

export const CardContainer = styled.div`
  margin-top: 2rem;

  display: flex;

  flex-direction: column;
`;

export const CardContent = styled.div`
  background-color: ${props => props.theme.white};

  border-radius: 0 0.75rem 0.75rem 0.75rem;
`;

export const CardHeaderItem = styled.div<{ selected: boolean }>`
  padding: 1rem;

  background-color: ${props =>
    props.selected ? props.theme.white : 'transparent'};

  border-radius: 0.75rem 0.75rem 0 0;

  cursor: pointer;

  transition: 0.2s ease;

  span {
    font-weight: 600;
    font-size: 0.95rem;
    color: ${props => props.theme.black};

    opacity: ${props => (props.selected ? 1 : 0.33)};

    transition: 0.2s ease;
  }
`;

export const FrozenContainerPermissions = styled(FrozenContainer)``;

export const ItemContentPermissions = styled.div<{
  rowColumnMobile?: boolean;
  isSignersRow?: boolean;
}>`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.52rem;
  span {
    min-width: 24px !important;
    width: 24px !important;
    height: 24px !important;
  }
  ${props =>
    props.isSignersRow &&
    css`
      flex-direction: column !important;
      align-items: flex-start !important;
      li {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        padding: 0.2rem;
      }
      ul {
        width: 100%;
      }
    `}
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    ${props =>
      props.rowColumnMobile &&
      css`
        flex-direction: column !important;
        align-items: start !important;
      `}
  }
`;

export const ItemContainerPermissions = styled.div<{ isOperations?: boolean }>`
  display: flex;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    ${props =>
      props.isOperations &&
      css`
        flex-direction: column !important;
        align-items: flex-start !important;
      `}
  }
  gap: 0.25rem;
  strong {
    width: auto !important;
    min-width: 5rem;
  }
`;

export const OperationsContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column !important;
    align-items: flex-start !important;
  }
  flex-wrap: wrap;
  gap: 1rem;
`;

export const OperationsContent = styled.div<{ isChecked?: boolean }>`
  gap: 0.5rem;
  width: 16rem;
  border-bottom: none !important;
  padding: 0 !important;
  p {
    opacity: ${({ isChecked }) => !isChecked && 0.5};
  }
`;

export const CheckboxOperations = styled.input`
  height: 1rem;
  width: 1rem;
  background: none;
  -webkit-appearance: none;
  border-radius: 0.2rem;

  ::before {
    content: ${({ checked }) => (checked ? "''" : "'\\2715'")};
    color: ${({ checked, theme }) =>
      checked ? 'transparent' : theme.true.white};
    display: flex;
    align-items: center;
    justify-content: center;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    border: 0;
    background-color: ${({ checked, theme }) =>
      checked ? theme.green : theme.line.border};
    opacity: ${({ checked }) => (checked ? 1 : 0.5)};
    background-size: contain;
    box-shadow: none;
  }
`;

export const ButtonExpand = styled.button`
  position: absolute;
  padding: 0.7rem;
  width: 6rem;
  top: 0;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    top: -3rem;
  }
  right: 0;
  border-radius: 0.5rem;
  background-color: ${props => props.theme.purple};
  color: ${props => props.theme.true.white};
`;

export const FrozenContentRewards = styled.div`
  width: 100%;
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.card.border};
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
`;

export const ContainerSigners = styled(ItemContentPermissions)`
  background-color: ${({ theme }) => theme.filter.signersPermission};
  border-radius: 0.5rem;
  padding: 0 !important;
`;

export const RowContentFPRPoll = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const ValidOperation = styled(TickSquare).attrs(() => ({
  size: 10,
}))`
  path {
    fill: ${({ theme }) => theme.green};
  }
`;
