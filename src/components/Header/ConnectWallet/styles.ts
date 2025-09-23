import { transparentize } from 'polished';
import styled, { css, keyframes } from 'styled-components';

export const ConnectButton = styled.div<{
  walletAddress?: boolean;
  $loading?: boolean;
  $searching?: boolean;
}>`
  max-width: 200px;
  width: 100%;
  height: 36px;
  padding: 0.5rem 1rem;
  border-radius: 24px;
  position: relative;
  background: ${props => (props.walletAddress ? 'none' : props.theme.violet)};
  opacity: ${props => (props.$searching ? '0' : '1')};
  pointer-events: ${props => (props.$searching ? 'none' : 'all')};
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  text-align: center;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  color: ${props => props.theme.true.white};

  cursor: pointer;

  input {
    display: none;
  }

  span {
    white-space: nowrap;
  }

  label {
    cursor: pointer;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    max-width: 100%;
  }

  &:hover {
    filter: brightness(1.2);
  }

  ${({ $loading }) =>
    $loading &&
    css`
      overflow: hidden;
      &&::before {
        content: '';
        background: conic-gradient(transparent, 280deg, white, transparent);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        aspect-ratio: 1;
        width: 100%;
        animation: rotate 1.5s linear infinite;
      }

      &::after {
        content: '';
        background: inherit;
        position: absolute;
        inset: 3px;
        border-radius: 24px;
        height: calc(100% - 2 * 3px);
        width: calc(100% - 2 * 3px);
      }

      @keyframes rotate {
        from {
          transform: translate(-50%, -50%) scale(1.4) rotate(0turn);
        }
        to {
          transform: translate(-50%, -50%) scale(1.4) rotate(1turn);
        }
      }
    `}
`;

export const ButtonAndCopy = styled.div`
  display: flex;
  align-items: center;
`;

export const NavBarOptionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    justify-content: flex-end;
    margin: 0;
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: flex-end;
    margin: 0;
    flex-direction: column;
  }
`;

export const NavBarOptionsItems = styled.div`
  display: flex;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const MenuTransaction = styled.ul`
  color: ${props => props.theme.navbar.text};
  border-radius: 10px;
  gap: 0.5rem;
  margin-top: 0.3rem;

  @media ${props => props.theme.breakpoints.mobile} {
    background-color: ${props => transparentize(0.7, props.theme.black)};
  }
`;

export const MobileTransaction = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.navbar.text};
`;

export const FadeIn = keyframes`
  from {
    opacity: 0.1;
    transform: translateX(-25%) translateY(-4px);

  }
  to {
    opacity: 1;
    transform: translateX(-25%) translateY(0);
  }
`;

export const BackGroundUserInfo = styled.div<{ isOpen?: boolean }>`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;

  background-color: ${props => transparentize(0.5, props.theme.true.black)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  opacity: ${props => (props.isOpen ? 1 : 0)};

  transition: all 0.1s linear;
  z-index: 6;
`;

export const BackgroundHelper = styled.div<{ opened: boolean }>`
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  position: fixed;
  visibility: ${props => (props.opened ? 'visible' : 'hidden')};
  opacity: ${props => (props.opened ? 1 : 0)};

  background-color: ${props =>
    transparentize(props.theme.dark ? 0.85 : 0.7, props.theme.black)};

  transition:
    opacity 0.5s ease,
    visibility 0.5s ease;
  z-index: 3;
`;

export const ConnectedWallet = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  position: relative;
  background-color: ${({ theme }) => (theme.dark ? '#161616' : '#FFFFFF')};
  border: 1px solid ${({ theme }) => (theme.dark ? '#161616' : '#E1E1E1')};
  border-radius: 0.5rem;
  padding: 0.75rem;
  gap: 0.5rem;

  svg {
    path {
      color: ${props =>
        props.theme.dark ? props.theme.true.white : props.theme.true.black};
    }
  }
`;

export const GraySpan = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.3rem;
  &:hover {
    filter: brightness(1.3);
  }

  svg {
    path {
      color: ${props => props.theme.red};
    }
  }
`;

export const BlackSpan = styled.span`
  color: ${props => props.theme.black};
  font-size: 0.75rem;
  font-weight: 700;
`;
