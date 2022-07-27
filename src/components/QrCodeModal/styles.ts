import styled, { css } from 'styled-components';

export const ModalBackdrop = styled.div`
    position:fixed;
    padding:0;
    margin:0;
    z-index: 98;
    top:0;
    left:0;

    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color:rgba(0,0,0,0.5);
`;

export const ModalContainer = styled.div`
  width: 170px;
  border-radius: 10%;
  position: relative;
  background-color: ${props => props.theme.white};
  display: block;
  animation: fadeIn 1s;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

export const ModalBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

export const ModalHeader = styled.div`
  color: ${props => props.theme.gray};
  padding-right: 9px;
  position: relative;
  text-align: right;
`;

export const ModalXButton = styled.button`
  color: ${props => props.theme.black};
`;
