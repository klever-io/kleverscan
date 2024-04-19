import styled, { css, keyframes } from 'styled-components';

const animatedDropdown = keyframes`
  0% {
    transform: scaleY(0.8);
    transform-origin: 0 0;

    opacity: 0;
    visibility: hidden;
  }

   to {
    transform: scaleY(1);
    transform-origin: 0 0;

    opacity: 1;
    visibility: visible;
  }

`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.36rem;
  gap: 1rem;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 4rem;
  margin-top: 1rem;
  color: ${props => props.theme.true.white};
  transition: 1000ms ease;
  z-index: -1;

  background: ${props => props.theme.violetPurpleGradient};

  > div {
    display: flex;
    width: 100%;
    @media (min-width: 768px) {
      align-items: center;
    }
  }

  svg {
    font-size: 1.5rem;
  }

  @media (min-width: 768px) {
    justify-content: center;
    gap: 0;
  }
`;

export const InteractionButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  > button {
    align-self: unset;
    background-color: unset;
  }
`;

export const CreateTxHeader = styled.div`
  justify-content: space-between;
`;

export const ShortCutDropdown = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  padding: 2rem 1.5rem;

  position: absolute;
  top: 3.5rem;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;

  background: ${props => props.theme.violetPurpleGradient};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  opacity: ${props => (props.isOpen ? 1 : 0)};
  mask: linear-gradient(to bottom, white 60%, transparent 120%);

  font-weight: 700;

  > button {
    align-self: unset;
    background-color: unset;
    width: fit-content;

    padding: 2rem 2rem;

    justify-content: flex-start;
    text-align: start;
  }

  ${props =>
    props.isOpen &&
    css`
      animation: ${animatedDropdown} 0.3s ease;
    `}
`;

export const Button = styled.button<{ isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.true.white};
  background: ${props =>
    props.theme.dark ? props.theme.purple : props.theme.violet};

  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: 700;
  ${props =>
    props.isMobile &&
    css`
      padding: 1.5rem 1rem;
    `}

  &:hover {
    background: ${props => props.theme.violet};
    filter: brightness(1.2);
  }

  &:last-child {
    margin-right: 3rem;
  }
`;
