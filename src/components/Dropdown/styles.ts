import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: start;
  text-transform: none;
  margin: 0;

  p {
    margin-top: 0.25rem;
  }

  button {
    color: #000;
    margin-left: 2rem;
  }

  strong {
    text-transform: capitalize;
  }
`;

export const ListUris = styled.div`
  display: flex;
  flex-direction: column;
  a {
    color: ${props => props.theme.black};
  }
`;
