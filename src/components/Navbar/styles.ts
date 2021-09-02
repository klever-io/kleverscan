import styled from 'styled-components';

import { INavbar } from '.';

export const NavbarContainer = styled.nav<INavbar>`
  padding: 1rem 17.5rem;

  width: 100%;

  display: flex;

  flex-direction: row;
  align-items: center;

  background-color: ${props =>
    props.background ? props.theme.navbar.background : 'transparent'};

  color: ${props => props.theme.white};

  animation: 1s ease 0s 1 normal none running fadein;

  @media (max-width: 1200px) {
    padding: 1rem 7rem;
  }

  @media (max-width: 992px) {
    padding: 1rem 2.5rem;

    justify-content: space-between;
  }
`;

export const LogoContainer = styled.div`
  margin-right: 7.5%;
`;

export const ItemsContainer = styled.div`
  display: flex;

  flex-direction: row;

  gap: 1.5rem;

  @media (max-width: 992px) {
    display: none;
  }
`;

export const Item = styled.button`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 0.25rem;

  transition: 0.2s ease;

  span {
    font-weight: 400;
    font-size: 0.8rem;

    text-transform: uppercase;
  }

  &:hover {
    opacity: 0.7;
  }
`;

export const MobileButton = styled.button`
  display: none;

  padding: 0.75rem;

  align-items: center;
  justify-content: center;

  background-color: ${props => props.theme.navbar.mobile};

  border-radius: 0.25rem;

  font-size: 1.1rem;

  @media (max-width: 992px) {
    display: flex;
  }
`;

export const MobileContainer = styled.div`
  left: 0;
  top: 4.6rem;
  width: 100%;

  z-index: 2;

  padding: 1rem 2.5rem;

  position: absolute;
  display: none;

  flex-direction: column;
  justify-content: center;

  gap: 1rem;

  background-color: ${props => props.theme.navbar.mobileContainer};

  span {
    font-size: 0.85rem;
  }

  svg {
    font-size: 1rem;
  }
`;
