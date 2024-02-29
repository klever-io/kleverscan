import styled, { css } from 'styled-components';

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 24px 0;

  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.faq.border};
  }

  svg {
    path {
      fill: ${({ theme }) => theme.black};
    }
  }
`;

export const Title = styled.h3`
  color: ${({ theme }) => theme.black};

  width: 75%;
  font-style: normal;
  font-weight: 300;
  font-size: 1.5rem;
  line-height: 1.875rem;
`;

export const Body = styled.p<{ isOpen: boolean }>`
  color: ${({ theme }) => theme.secondaryText};

  display: none;
  visibility: hidden;
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1rem;

  ${({ isOpen }) =>
    isOpen &&
    css`
      display: block;
      visibility: visible;
    `}
`;

export const CardContainer = styled.div`
  background-size: cover;

  margin: auto;

  display: flex;
  flex-direction: column;
  justify-content: center;

  gap: 8px;
`;
