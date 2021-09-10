import styled, { css } from 'styled-components';

import { IInput } from '.';

const ContainerMainPage = css`
  border: 1px solid transparent;
  border-radius: 0.65rem;

  box-shadow: 0px 12px 25px ${props => props.theme.input.shadow};

  &:focus-within {
    border-color: ${props => props.theme.input.activeBorder};
    box-shadow: 0px 3px 20px ${props => props.theme.input.activeShadow};
  }
`;

export const Container = styled.div<IInput>`
  padding: 0.1rem;

  position: relative;
  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: space-between;

  background-color: ${props => props.theme.white};

  border: 1px solid ${props => props.theme.input.border};
  border-radius: 0.25rem;

  transition: 0.5s ease;

  ${props => props.mainPage && ContainerMainPage};

  &:focus-within {
    border-color: ${props => props.theme.input.activeBorder};
  }

  div {
    &:first-child {
      display: flex;

      flex-direction: row;
      align-items: center;
    }
  }

  svg {
    margin-left: 0.5rem;

    color: ${props => props.theme.input.placeholder};
    font-size: 2rem;
  }

  input {
    margin: 0 0.25rem 0 0.5rem;

    min-width: 40rem;

    font-weight: 300;

    &::placeholder {
      color: ${props => props.theme.input.placeholder};
    }

    @media (max-width: 1200px) {
      min-width: 36rem;
    }

    @media (max-width: 560px) {
      min-width: unset;
    }
  }

  @media (max-width: 425px) {
    padding: 0.5rem;
    width: 80%;

    justify-content: unset;

    button {
      position: absolute;

      top: 4rem;
      right: 25%;
      width: 50%;
    }

    svg {
      margin-left: 0;
    }

    input {
      width: 85%;

      position: absolute;
      right: 0;
    }
  }
`;

export const ErrorContainer = styled.div<{ error: boolean }>`
  width: fit-content;
  margin: 0.5rem auto 0 auto;
  padding: 0.5rem 1rem;

  background-image: ${props => props.theme.input.error};

  border-radius: 0.25rem;

  z-index: -1;

  visibility: ${props => (props.error ? 'visible' : 'hidden')};
  opacity: ${props => (props.error ? 1 : 0)};

  span {
    font-weight: 400;
    color: ${props => props.theme.white};
    font-size: 1rem !important;
  }

  @media (max-width: 425px) {
    margin-top: 5rem;
  }
`;
