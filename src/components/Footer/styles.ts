import styled, { keyframes } from 'styled-components';

export const Container = styled.footer`
  background-color: ${props => props.theme.footer.background};
  height: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding-top: 3rem;
  }
`;

const FadeIn = keyframes`
  from {
    transform: translateX(0%) translateY(-2rem);

  }
  to {
    transform: translateX(0%) translateY(0);
  }
`;
export const Content = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 0 1.5rem;
  justify-content: center;
  display: flex;
  flex-direction: row;
  gap: 4rem;
  flex-direction: column;
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 2rem;
    padding-bottom: 10rem;
    height: 100%;
  }
`;

export const DescriptionContainer = styled.div`
  display: flex;
  padding: 1.5rem 0 2rem 0;
  flex-direction: column;
  flex: 0 0 40%;
  background: linear-gradient(
    180deg,
    rgba(34, 35, 69, 0.5) 0%,
    rgba(34, 35, 69, 0) 100%
  );
  border-radius: 16px;
  gap: 2rem;
  span {
    padding: 0rem 1rem;
    text-align: center;
    font-weight: 500;
    font-size: 1rem;
    color: white;
    line-height: 1.25rem;
  }
  align-items: center;

  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: start;
    align-items: start;
    flex: 0 0 20%;
    padding: 0rem;
    background: none;
    span {
      text-align: start;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
    }
  }
`;

export const LogoContainer = styled.div`
  padding: 1rem 0 0 1rem;
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0rem 0 0 1rem;
  }
`;

export const SocialContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;

  gap: 0.75rem;
`;

export const SocialIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;

  display: flex;

  align-items: center;
  justify-content: center;

  border: 2px solid ${props => props.theme.footer.socialBorder};
  border-radius: 50%;

  color: white;
  font-size: 0.85rem;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.violet};
    background-color: ${props => props.theme.violet};
  }
`;

export const LinksContainer = styled.div`
  display: flex;

  flex-direction: column;
  flex: 0 0 20%;
  :nth-child(-n + 4) {
    border-bottom: 1px solid #222345;
  }
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    :nth-child(-n + 4) {
      border-bottom: 0;
    }
    height: 10rem;
    flex: 0 0 18rem;
  }
`;

export const LinkItems = styled.div`
  display: flex;
  flex-direction: column;

  span {
    min-width: 10rem;
    font-weight: 500;
    color: white;
  }

  a {
    display: flex;

    align-items: center;

    gap: 0.5rem;

    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    color: ${props => props.theme.true.white};
    text-decoration: none;
    transition: 0.2s ease;
    margin-bottom: 2rem;

    &:hover {
      color: ${props => props.theme.violet};
    }
  }
`;

export const DonateContainer = styled.div`
  position: relative;
  p {
    display: flex;

    align-items: center;

    gap: 0.5rem;

    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    color: ${props => props.theme.true.white};

    text-decoration: none;

    transition: 0.2s ease;

    > svg:not(:first-child) {
      zoom: 0.85;
    }

    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    &:hover {
      color: ${props => props.theme.violet};
    }
  }
`;
export const VersionBuildContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: flex-end;
  p {
    font-size: 0.75rem;
    font-weight: 500;
    color: ${props => props.theme.borderLogo};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    justify-content: center;
    padding-bottom: 6rem;
  }
`;

export const QrCodeDropdown = styled.div<{ active: boolean }>`
  position: absolute;
  width: 170px;
  height: 170px;
  border-radius: 20px;
  background-color: ${props => props.theme.white};
  bottom: 2rem;
  display: ${props => (props.active ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  animation: ${FadeIn} 0.1s ease-in-out;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  div {
    background-color: #fff;
    padding: 0.3rem 0.3rem 0.1rem 0.3rem;
    border-radius: 0.3rem;
    svg {
      cursor: default !important;
    }
  }
`;

export const ContainerHeaderItems = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.true.white};
  justify-content: space-between;
  padding-bottom: 2rem;
  span {
    font-weight: 500;
    font-size: 24px;
    line-height: 18px;
  }
  div {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    cursor: pointer;
  }
`;
