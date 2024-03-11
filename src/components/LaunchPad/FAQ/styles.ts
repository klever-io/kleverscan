import styled from 'styled-components';

export const FAQContainer = styled.div`
  max-width: 1900px;

  display: flex;
  justify-content: space-between;

  padding: 0 114px;

  gap: 150px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 10px;
    align-items: center;
    flex-direction: column;
    gap: 16px;
  }
`;

export const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SiteTip = styled.p`
  color: ${({ theme }) => theme.violet};
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.2rem;
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.black};
  font-weight: 700;
  font-size: 3rem;
  line-height: 1.1;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 5rem;
    max-width: 450px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 550px;
  }
`;
