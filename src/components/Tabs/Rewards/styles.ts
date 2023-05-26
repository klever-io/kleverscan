import { FrozenContainer } from '@/views/accounts/detail';
import { MdKeyboardArrowDown } from 'react-icons/md';
import styled from 'styled-components';

export const FrozenContainerRewards = styled(FrozenContainer)`
  position: relative;
  display: flex;

  span {
    padding: 0.8rem;
    padding-left: 2rem;
  }
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.card.border};
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  div {
    padding: 0;
  }
`;

export const ArrowExpand = styled(MdKeyboardArrowDown)<{ expended: boolean }>`
  position: absolute;
  width: 25px;
  height: 25px;
  bottom: 0.47rem;
  left: 6.5rem;
  transform: ${({ expended }) => (expended ? 'rotate(180deg)' : '')};
`;

export const FrozenContent = styled.div``;

export const ButtonContent = styled.div`
  display: flex;
  justify-content: center;
  p {
    width: fit-content !important;
    padding: 0 0 0.7rem 0rem;
  }
  margin-top: 0.5rem;
  cursor: pointer;
`;
