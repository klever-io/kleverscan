import styled from 'styled-components';

export const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 114px 56px;

  min-height: 60vh;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;

  padding-top: 72px;

  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  gap: 32px;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;

export const RightSide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  img {
    border-radius: 16px;
    object-fit: cover;

    max-height: 350px;
    max-width: 80%;
  }
`;

export const LeftSide = styled.div`
  max-width: 100%;
  justify-content: center;

  display: flex;
  flex-direction: column;
  gap: 24px;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-width: 50%;
    justify-content: flex-start;
  }
`;

export const Label = styled.p`
  color: ${({ theme }) => theme.violet};
  font-weight: 800;
  font-size: 1.125rem;
  line-height: 1.875rem;
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.black};
  font-weight: 700;
  font-size: 2.5rem;
  line-height: 1;
  letter-spacing: 1px;
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.black};
  font-weight: 300;
  font-size: 1.25rem;
  line-height: 1.875rem;
  letter-spacing: 1px;
`;

export const Buttons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

export const Button = styled.button<{ secondary?: boolean }>`
  padding: 14px 26px;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.violet};
  background-color: ${({ theme, secondary }) =>
    !secondary ? theme.violet : 'transparent'};
  color: ${({ theme, secondary }) =>
    secondary ? theme.black : theme.true.white};

  cursor: pointer;

  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1rem;

  transition: 0.3s;
  &:hover {
    filter: brightness(1.2);
  }
`;
