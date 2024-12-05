import styled, { css, keyframes } from 'styled-components';
interface DropdownProps {
  show: boolean;
}

const FadeIn = keyframes`
  from {
    transform: translateX(0%) translateY(-2rem);
  }
  to {
    transform: translateX(0%) translateY(0);
  }
`;

export const LinkWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

export const Dropdown = styled.div<DropdownProps>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  z-index: 1000;
  position: absolute;
  top: 100%;
  left: 5rem;
  background-color: ${props => props.theme.dropdown.background};
  border: 1px solid 515395;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 12px;
  width: 15rem;
  padding: 1rem 0px;
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    left: -16rem;
  }
`;

export const DropdownLink = styled.a`
  display: flex;
  gap: 0.5rem;
  align-items: start;
  justify-items: start;
  text-decoration: none;
`;

export const DropdownLinkContainer = styled.div`
  padding: 8px 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const QrCodeDropdown = styled.div<{ active: boolean }>`
  padding: 1rem 1.5rem;
  position: absolute;
  right: -10rem;
  z-index: 1000;
  border-radius: 20px;
  background-color: ${props => props.theme.dropdown.background};
  bottom: 2rem;
  display: ${props => (props.active ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${FadeIn} 0.1s ease-in-out;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  div {
    div {
      padding: 1rem;
      border-radius: 0.3rem;
      svg {
        cursor: default !important;
      }
    }
  }
`;

export const QrCodeDropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DropdownTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
`;
export const QrCodeTitle = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.black};
`;
export const DropdownActionItemPadding = styled.div`
  padding: 1rem 0px;
  border-bottom: 1px solid #3e3e40;
  width: 100%;
  justify-items: flex-start !important;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  flex-direction: column;
`;
export const DropdownActionItem = styled.div<{
  secondary?: boolean;
  active?: boolean;
  disabled?: boolean;
}>`
  position: static;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  height: 2.5rem;
  font-size: 14px;
  font-weight: 400;
  padding: 0.75rem;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;

  ${props =>
    props.active &&
    css`
      color: ${props.theme.true.white};
      background-color: ${props.theme.footer.border};
      border-bottom: 1px solid ${props => props.theme.card.border};

      border-radius: 6px 6px 0 0;
      font-weight: 500;
    `}

  ${props =>
    props.secondary &&
    css`
      margin-left: 24px;
      margin-right: 4px;

      background-color: ${props.theme.blue};

      &:last-child {
        margin-bottom: 4px;
      }
    `}

  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.75;
      filter: grayscale(0.25);
    `}

    ${props =>
    !props.disabled &&
    !props.active &&
    css`
      &:hover {
        color: ${props => props.theme.violet};
      }
    `}

  svg {
    &:nth-child(3) {
      margin-left: auto;

      transition: transform 0.2s ease-in-out;
      ${props =>
        props.active &&
        css`
          transform: rotate(180deg);
        `}
    }
  }
`;
