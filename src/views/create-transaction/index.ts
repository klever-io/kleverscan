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

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const Container = styled.div``;
