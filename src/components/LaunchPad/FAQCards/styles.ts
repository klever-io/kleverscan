import styled from 'styled-components';

export const FAQContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  justify-content: space-between;
  row-gap: 24px;

  width: 100%;
  padding: 54px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0;
  }
`;
