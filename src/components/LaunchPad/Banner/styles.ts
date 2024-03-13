import styled from 'styled-components';

export const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 56px 0;

  min-height: 40vh;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: 60vh;
    max-height: 665px;
    padding: 0 114px 56px;
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;

    right: 0;

    min-height: 40vh;

    background-image: url('/images/launchpad-banner.png');
    background-size: cover;

    @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      min-height: 60vh;
    }
  }
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  max-width: 100%;

  padding-top: 10px;

  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  gap: 24px;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-width: 50%;
    padding-top: 72px;
  }
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.true.white};
  font-weight: 700;
  font-size: 3.75rem;
  line-height: 1;
  letter-spacing: 1px;

  > strong {
    color: ${({ theme }) => theme.violet};
  }

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 5rem;
    line-height: 1.2;
    text-align: left;
  }
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.darkText};
  font-weight: 300;
  font-size: 1.5rem;
  line-height: 1.875rem;
  letter-spacing: 1px;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    text-align: left;
  }
`;

export const Buttons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;

  width: 100%;
`;

export const Button = styled.button<{ secondary?: boolean }>`
  padding: 14px 26px;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.violet};
  background-color: ${({ theme, secondary }) =>
    !secondary ? theme.violet : 'transparent'};
  color: ${({ theme }) => theme.true.white};

  cursor: pointer;

  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1rem;

  transition: 0.3s;
  &:hover {
    filter: brightness(1.2);
  }
`;
