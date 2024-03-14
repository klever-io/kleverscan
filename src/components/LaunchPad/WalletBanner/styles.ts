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

  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  align-items: center;
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
    max-width: 80%;

    @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      object-fit: contain;
    }
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

export const Links = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

export const LinkStyle = styled.a`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.black};
  color: ${({ theme }) => theme.black};

  width: 145px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  cursor: pointer;

  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1rem;

  transition: 0.3s;
  &:hover,
  &:focus,
  &:active {
    color: ${({ theme }) => theme.black};
    filter: brightness(1.2);
  }

  &:last-child {
    width: unset;
  }
`;
