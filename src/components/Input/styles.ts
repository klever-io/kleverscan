import styled from 'styled-components';

export const Container = styled.div`
  padding: 0.8rem 1rem;

  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  border: 1px solid ${props => props.theme.lightGray};
  border-radius: 0.5rem;

  cursor: text;

  transition: 0.2s ease;
  input {
    width: 100%;
    min-width: 5rem;

    font-size: 0.85rem;

    color: ${props => props.theme.darkText};

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

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;
