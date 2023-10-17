import styled, { css } from 'styled-components';

export const Container = styled.div<{ isInHomePage: boolean }>`
  background-color: ${props =>
    props.theme.dark ? props.theme.footer.background : props.theme.true.white};
  position: relative;
  padding: 0.75rem 1rem;
  display: flex;
  width: 100%;
  min-width: 11rem;
  max-width: 20rem;
  border: none;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  border-radius: 0.5rem;
  mix-blend-mode: normal;
  cursor: text;

  border: 1px solid ${props => props.theme.white && props.theme.lightGray};
  ${props =>
    props.theme.dark &&
    css`
      border: 1px solid ${({ theme }) => theme.input.borderSearchBar};
    `}

  ${props =>
    props.isInHomePage &&
    css`
      max-width: initial;
      width: 100%;
    `}

  transition: 0.2s ease;
  input {
    width: 100%;
    min-width: 5rem;

    color: ${props => props.theme.input.border.search} !important;

    &::placeholder {
      color: ${props => props.theme.input.border.search};
    }

    &::selection {
      background-color: ${props => props.theme.darkText};
    }

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      min-width: 0;
    }
  }

  svg {
    cursor: pointer;
  }
`;

export const FocusBackground = styled.div`
  position: fixed;
  z-index: 6;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
`;
