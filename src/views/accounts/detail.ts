import { TickSquare } from '@/assets/icons';
import styled, { css } from 'styled-components';

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

export const BalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const BalanceKLVValue = styled.span`
  display: flex;

  align-items: center;
  gap: 1rem;
`;

export const BalanceTransferContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  button {
    align-self: center;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 0.5rem;
  }
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

export const ItemContentPermissions = styled.div<{
  rowColumnMobile?: boolean;
  isSignersRow?: boolean;
}>`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.2rem;
  border: none !important;
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
    max-width: 9rem;
    min-width: 2rem;
  }
`;

export const OperationsContainer = styled.div`
  display: flex;
  position: relative;
  padding: 0rem !important;
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
  border: none !important;
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

  &::before {
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

export const RewardsAvailableContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FrozenContainerLi = styled.li`
  div {
    padding: 0;
  }
`;

export const Em = styled.em`
  font-style: normal;
  min-width: 8rem;
  margin-right: 5px;
`;
