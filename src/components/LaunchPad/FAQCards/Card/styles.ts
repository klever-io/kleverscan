import styled from 'styled-components';

export const Title = styled.h3`
  color: ${({ theme }) => theme.black};
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.5rem;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1rem;
`;

export const CardContainer = styled.div`
  background-image: url('/images/faq_card.svg');
  background-size: cover;

  width: 100%;
  max-height: 190px;
  max-width: 420px;
  aspect-ratio: 2.26;

  padding-top: 29px;
  padding-left: 53px;
  padding-right: 35px;

  display: flex;
  flex-direction: column;

  gap: 48px;
`;

export const FAQAction = styled.a`
  color: ${({ theme }) => theme.black};
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 0.875rem;
  text-decoration: none;

  display: flex;
  align-items: end;
  gap: 2px;

  cursor: pointer;
  transition: 0.2s;

  svg {
    path {
      transition: 0.2s;
    }
  }

  &:hover {
    color: ${({ theme }) => theme.violet};

    svg {
      path {
        fill: ${({ theme }) => theme.violet};
      }
    }
  }
`;
