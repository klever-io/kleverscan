import styled, { keyframes } from 'styled-components';

interface ConfirmButtonProps {
  isActive: boolean;
}

interface CalendarContainerProps {
  modalLeft: boolean;
}

export const fadeInItem = keyframes`
  from {
    opacity: 0.1;
    transform: translateY(4px);

  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
export const fadeInContainer = keyframes`
  from {
    opacity: 0.1;
    transform: translateY(calc(100% + 5px));

  }
  to {
    opacity: 1;
    transform: translateY(100%);
  }
`;

export const fadeInContainerMobile = keyframes`
  from {
    opacity: 0.1;
    transform: translateY(calc(90% + 5px)) translateX(-50%);


  }
  to {
    opacity: 1;
    transform: translateY(90%) translateX(-50%);

  }
`;

export const Container = styled.div`
  margin-left: auto;
  display: block;
  width: fit-content;
  position: relative;
`;

export const Input = styled.input`
  width: 75%;
  font-weight: 700;
  font-size: 0.95rem;
  color: ${props => props.theme.violet};

  caret-color: transparent;

  cursor: pointer;
  &::placeholder {
    color: ${props => props.theme.violet};
  }
  &:not([value='']) {
    animation: ${fadeInItem} 0.2s ease-in-out;
    width: 100%;
    text-align: center;
  }
`;

export const PaginationModalContainer = styled.div.attrs(
  (props: CalendarContainerProps) => {
    props: props.modalLeft;
  },
)`
  min-height: 10.5rem;
  width: 13rem;
  padding: 1rem;

  background-color: ${props => props.theme.white};

  position: absolute;
  bottom: 14rem;
  left: -3rem;
  transform: translateY(100%);

  z-index: 1;

  border-radius: 20px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);

  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    animation: ${fadeInContainer} 0.2s linear;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    left: ${props => (props.modalLeft ? '4.5rem' : '-3rem')};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    animation: ${fadeInContainerMobile} 0.2s linear forwards;
  }
`;
export const PaginationModalHeader = styled.div`
  color: ${props => props.theme.black};
  margin-bottom: 0.8rem;
  strong {
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    svg {
      cursor: pointer;
    }
  }
  p {
    font-weight: 400;
    font-size: 0.9rem;
    margin: 1rem 0;
  }
`;

export const PaginationModalContent = styled.div`
  display: flex;
  flex-direction: column;
  user-select: none;
`;

export const Confirm = styled.button.attrs((props: ConfirmButtonProps) => ({
  isActive: props.isActive,
}))`
  margin-top: 1rem;
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: ${props => props.theme.purple};
  transition: all 0.1s ease-in-out;
  ${props =>
    !props.isActive &&
    `
    filter: opacity(0.5);
    pointer-events: none;
  `}
`;
