import styled from 'styled-components';

export const FAQContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));

  padding: 70px;

  gap: 24px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0;
  }
`;
