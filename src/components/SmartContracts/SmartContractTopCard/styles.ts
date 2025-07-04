import styled from 'styled-components';

export const DataCardsWrapper = styled.div`
  width: 100%;
`;

export const DataCardsContent = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;

  justify-content: center;

  gap: 16px;

  @media (max-width: ${props =>
      props.theme.breakpoints.tablet}) and (min-width: ${props =>
      props.theme.breakpoints.mobile}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;
