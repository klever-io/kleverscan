import { DefaultCardStyles } from '@/styles/common';
import styled, { css } from 'styled-components';

export const SearchWrapper = styled.div`
  position: relative;
`;

export const Container = styled.div`
  ${DefaultCardStyles}
  position: relative;
  padding: 0.75rem 1rem;
  display: flex;
  width: 100%;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  border-radius: 0.5rem;
  mix-blend-mode: normal;
  cursor: text;

  ${props =>
    props.theme.dark &&
    css`
      border: 1px solid ${({ theme }) => theme.input.borderSearchBar};
    `}

  transition: 0.2s ease;
  input {
    width: 100%;
    min-width: 5rem;

    font-size: 0.9rem;

    color: ${props => props.theme.input.border.search};

    &::placeholder {
      color: ${props => props.theme.darkText};
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
