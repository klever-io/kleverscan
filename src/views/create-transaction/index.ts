import styled from 'styled-components';

export const CardContainer = styled.div`
  margin: auto;
  width: 90%;
  max-width: 1200px;
  margin-bottom: -2rem;
  padding: 2rem 0;

  font-family: Rubik;
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;

  @media screen and (max-width: 1025px) {
    width: 100%;
  }
`;

export const Container = styled.div`
  padding: 3rem 10rem 8rem 10rem;
  background-color: ${props => props.theme.background};
  @media (max-width: 1600px) {
    padding-left: 5rem;
    padding-right: 5rem;
  }
  @media (max-width: 768px) {
    padding: 1rem 1rem 2rem 1rem;
  }
`;
