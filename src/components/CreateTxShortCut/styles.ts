import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;

  h3 {
    color: ${props => props.theme.black};
  }
`;

export const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;
  overflow-x: scroll;
  padding-bottom: 1rem;
  padding: 0 1rem 1rem;

  @media (min-width: 768px) {
    overflow: hidden;
    padding: 0;
  }
`;

export const Button = styled.button`
  display: flex;
  padding: 0.5rem 0.5rem;
  background: ${props => props.theme.violet};
  color: ${props => props.theme.true.white};
  border-radius: 10px;

  span {
    width: 8rem;
  }

  &:hover {
    filter: brightness(1.2);
  }
`;
