import styled from 'styled-components';

export const Container = styled.div`
  padding: 0.75rem 1rem;

  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  border: 1px solid ${props => props.theme.input.border.default};
  border-radius: 0.5rem;

  cursor: text;

  transition: 0.2s ease;

  input {
    min-width: 20rem;
    width: 100%;

    font-size: 0.85rem;

    color: ${props => props.theme.input.text};

    &::placeholder {
      color: ${props => props.theme.input.text};
    }

    &::selection {
      background-color: ${props => props.theme.input.text};
    }
  }

  svg {
    cursor: pointer;
  }
`;
