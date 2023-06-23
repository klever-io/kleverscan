import { GiPlainCircle } from 'react-icons/gi';
import { MdKeyboardArrowDown } from 'react-icons/md';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1.5rem 0.5rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.footer.border};
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    width: 33rem;
    border-bottom: none;
  }
`;

export const ContainerWallet = styled.div`
  position: relative;
  p {
    width: 10rem;
    color: ${props => props.theme.true.white};
    font-weight: 600;
    font-size: 0.9rem;
  }

  small {
    color: ${props => props.theme.text.gray};
    font-weight: 600;
  }
`;
export const BoxSelect = styled.div`
  display: flex;
  position: relative;
  width: 8.5rem;
  height: 3rem;
  background-color: ${props => props.theme.input.dateFilter};
  align-items: center;
  justify-content: start;
  border-radius: 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.true.white};
`;

export const ContainerItems = styled.div`
  p {
    width: auto;
    height: 1.2rem;
    font-weight: 600;
    font-size: 0.9rem;
    padding-left: 1.2rem;
  }
`;
export const ItemsSelect = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  position: absolute;
  flex-direction: column;
  gap: 0.3rem;
  padding-bottom: 0.5rem;
  background-color: ${props => props.theme.input.dateFilter};
  width: 8.5rem;
  height: auto;
  top: 2.7rem;
  z-index: 2;
  border-radius: 0.5rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

export const ArrowDown = styled(MdKeyboardArrowDown).attrs(props => ({
  size: 20,
}))<{ isOpen: boolean }>`
  position: absolute;
  right: 1rem;
  bottom: 0.7rem;
  transform: rotate(${props => (props.isOpen ? '180deg' : '0')});
`;

export const CircleConnected = styled(GiPlainCircle).attrs(props => ({
  size: 8,
}))`
  color: ${({ theme }) => theme.green};
  position: absolute;
  right: 0.7rem;
  bottom: 2.1rem;
`;
