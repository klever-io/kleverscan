import styled, { keyframes } from 'styled-components';

export const Container = styled.footer`
  background-color: ${props => props.theme.footer.background};
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
  padding: 5rem 2rem;
  justify-content: center;

  display: flex;

  flex-direction: row;
  gap: 5rem;
  border-top: 1px solid ${props => props.theme.footer.border};
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 5rem 3rem;

    flex-direction: column;
  }
`;

export const DescriptionContainer = styled.div`
  display: flex;

  flex-direction: column;
  flex: 0 0 40%;

  span {
    padding: 1.25rem 0;

    font-size: 0.9rem;
    font-weight: 500;
    color: white;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    align-items: center;

    span {
      line-height: 1.25rem;
    }
  }
`;

export const LogoContainer = styled.div`
  img {
    position: unset !important;
    display: unset !important;
    min-width: unset !important;
    max-width: unset !important;
    height: 28px !important;
    width: 224px !important;
  }
`;

export const SocialContainer = styled.div`
  display: flex;

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

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    align-items: center;
  }
`;

export const LinkItems = styled.div`
  display: flex;

  flex-direction: column;

  &:not(:last-child) {
    margin-bottom: 1.75rem;
  }

  span {
    padding-bottom: 1rem;
    min-width: 10rem;
    font-weight: 500;
    color: white;
  }

  a {
    display: flex;

    align-items: center;

    gap: 0.5rem;

    font-size: 0.9rem;
    font-weight: 400;
    color: ${props => props.theme.footer.text};

    text-decoration: none;

    transition: 0.2s ease;

    &:not(:last-child) {
      margin-bottom: 1rem;
    }

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

    font-size: 0.9rem;
    font-weight: 400;
    color: ${props => props.theme.footer.text};

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

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: center;
    margin-top: 1.5rem;
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
