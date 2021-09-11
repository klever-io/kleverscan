import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 30rem;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  font-size: 2rem;
  color: ${props => props.theme.table.text};

  span {
    font-weight: 400;
  }
`;

export const Subtitle = styled.span`
  margin: 0.5rem 0 1.5rem 0;

  background-image: ${props => props.theme.text.background};
  background-clip: text;
  -webkit-background-clip: text;

  color: transparent;
  font-weight: 500 !important;
  font-size: 1rem;

  @media (max-width: 768px) {
    text-align: center;
  }
`;
