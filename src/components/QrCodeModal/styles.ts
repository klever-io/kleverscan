import styled from 'styled-components';

export const ModalBackdrop = styled.div`
  position: fixed;
  padding: 0;
  margin: 0;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: default !important;
`;
export const ModalContainer = styled.div<{ isOverflow?: boolean }>`
  width: 170px;
  border-radius: 20px;
  position: absolute;
  left: ${props =>
    props.isOverflow ? 'calc(35rem + (50% - 8rem) / 3)' : 'calc(50% - 5rem)'};
  background-color: ${props => props.theme.white};
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  animation: fadeIn 1s;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  z-index: 4;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    left: ${props =>
      props.isOverflow ? 'calc(95% - 10rem)' : 'calc(50% - 10rem)'};
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    left: ${props =>
      props.isOverflow ? 'calc(95% - 15rem);' : 'calc(0% - 10rem)'};
  }
`;

export const ModalBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  padding: 0.5rem;

  div {
    background-color: #fff;
    padding: 0.3rem;
    border-radius: 0.3rem;
    svg {
      cursor: default !important;
    }
  }
`;

export const ModalHeader = styled.div`
  color: ${props => props.theme.black} !important;
  padding-right: 9px;
  position: relative;
  text-align: right;

  strong {
    font-size: 1.5rem !important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    svg {
      cursor: pointer;
    }
  }
`;
