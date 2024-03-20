import styled, { css } from 'styled-components';

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 24px 0;

  cursor: pointer;

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
  color: ${({ theme }) => theme.black};

  padding: 0 24px;

  visibility: hidden;
  opacity: 0;
  transform: translateY(-10px) scaleY(0);
  height: 0;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;

  transition: transform 0.1s ease-in-out, opacity 0.1s ease-in-out,
    visibility 0.1s ease-in-out;

  ${({ isOpen }) =>
    isOpen &&
    css`
      visibility: visible;
      opacity: 1;
      transform: translateY(0) scaleY(1);

      height: auto;
      padding: 24px;
    `}
`;

export const CardContainer = styled.div`
  background-size: cover;

  margin: auto;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;

  gap: 8px;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.faq.border};
  }
`;
