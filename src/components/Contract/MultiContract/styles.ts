import styled, { css } from 'styled-components';

export const Background = styled.div<{
  showMultiContractFull?: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  z-index: 4;

  visibility: ${props => (props.showMultiContractFull ? 'visible' : 'hidden')};

  backdrop-filter: brightness(0.2);
`;

export const ContainerQueue = styled.div<{
  isTablet: boolean;
  showMultiContractFull?: boolean;
}>`
  position: sticky;
  top: 10rem;
  color: white;
  width: 18rem;
  overflow-y: auto;
  backdrop-filter: brightness(1.5);
  margin-right: 0.55rem;

  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  min-height: 20rem;
  height: fit-content;
  max-height: calc(100vh - 16rem);

  padding: 1rem;
  border-radius: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    position: fixed;
    left: 10%;

    z-index: 5;
    width: 80%;

    margin: 0;
    padding: 1rem;

    background-color: ${props => props.theme.card.background};
    backdrop-filter: none;

    display: ${props => (props.showMultiContractFull ? 'flex' : 'none')};
  }
`;

export const ContractItem = styled.div<{ selected: boolean }>`
  min-width: 11rem;
  width: 100%;
  height: fit-content;
  padding: 0.75rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.5rem;

  background-color: ${props =>
    props.theme.dark ? props.theme.card.background : props.theme.lightGray};
  border-radius: 10px;
  cursor: pointer;

  ${props =>
    props.selected &&
    css`
      background-color: ${props =>
        props.theme.dark ? props.theme.purple : props.theme.lightPurple};
    `};

  transition: ease-in 100ms;
`;

export const Title = styled.h3`
  color: ${props => props.theme.black};
  font-size: 1.1rem;
`;

export const ContractsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  overflow-y: auto;

  > strong {
    color: ${props => props.theme.black};
  }
`;

export const CheckBoxInput = styled.input.attrs(() => ({
  type: 'checkbox',
  name: 'checkBtn',
}))`
  position: relative;
  width: 48px;
  height: 24px;
  -webkit-appearance: none;
  background: ${props => props.theme.purple};
  outline: none;
  border-radius: 12px;
  transition: 0.5s;
  cursor: pointer;
  margin: 1rem 0;

  &:checked {
    background: ${props => props.theme.violet};
  }

  &:before {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    border-radius: 50%;
    top: 2px;
    bottom: 2px;
    left: 2px;
    background: ${props => props.theme.true.black};
    transition: 0.5s;
    transform: translate(15%, 0);
  }

  &:checked:before {
    transform: translate(100%, 0);
    background: ${props => props.theme.true.white};
  }
`;

export const ButtonsContainer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: 1.5rem;
  }
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  justify-content: space-around;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: 1rem;
  }
`;

export const ContainerQueueMobile = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 19%;
  right: 5%;

  width: 120px;
  padding: 0.5rem;
  z-index: 999;

  border-radius: 10px;

  transform: translateY(-50%);

  background: ${props => props.theme.violet};
  color: ${props => props.theme.black};
`;

export const Button = styled.button<{
  primary?: boolean;
  submit?: boolean;
  addToQueue?: boolean;
}>`
  border-radius: 0.45rem;
  padding: 0.1rem 0.75rem;
  width: 100%;
  color: ${props => props.theme.true.black};
  background: ${props => props.theme.border};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    min-height: 2rem;
  }
  ${props =>
    (props.submit || props.addToQueue) &&
    css`
      background: ${props.theme.violet};
      padding: 0.5rem 1rem;
      color: ${props => props.theme.true.white};

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      @media (max-width: ${props => props.theme.breakpoints.tablet}) {
        min-height: 3rem;
      }
    `}

  ${props =>
    props.addToQueue &&
    css`
      background-color: ${props => props.theme.lightBlue};
    `}

  &:hover {
    filter: brightness(85%);
  }

  &:disabled {
    background: ${props => props.theme.border};
  }
`;

export const MultiContractModalInfo = styled.div`
  display: flex;
`;
