import styled from 'styled-components';

import { IInput } from '.';

export const Container = styled.div<IInput>`
  padding: 0.1rem;

  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: space-between;

  background-color: ${props => props.theme.white};

  border: 1px solid transparent;
  border-radius: ${props => (props.mainPage ? 0.65 : 0.25)}rem;

  box-shadow: 0px 12px 25px ${props => props.theme.input.shadow};

  transition: 0.5s ease;

  &:focus-within {
    border-color: ${props => props.theme.input.activeBorder};
    box-shadow: 0px 3px 20px ${props => props.theme.input.activeShadow};
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
  }
`;

export const ErrorContainer = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;

  background-image: ${props => props.theme.input.error};

  border-radius: 0.25rem;

  z-index: -1;

  span {
    font-size: 1rem !important;
  }
`;
