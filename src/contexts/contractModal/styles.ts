import { lighten } from 'polished';
import styled, { css } from 'styled-components';

export const ButtonModal = styled.button<{
  isLocked?: boolean;
  buttonStyle?: 'primary' | 'secondary' | 'contextModal';
}>`
  color: ${props => props.theme.black};
  background-color: transparent;
  border: 1px solid
    ${props => (!props.isLocked ? props.theme.violet : props.theme.darkGray)};

  font-size: 0.875rem;
  line-height: 1.25rem;

  align-self: end;

  min-width: 8rem;
  width: 100%;
  max-width: 15rem;

  padding: 4px 16px;
  border-radius: 24px;

  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  transition: all 0.1s ease;

  > span {
    color: ${props => props.theme.black} !important;
  }

  &:active {
    transform: ${props => (!props.isLocked ? 'translateY(0.1rem)' : 'none')};
  }

  &:hover {
    background-color: ${props =>
      props.isLocked ? props.theme.darkGray : props.theme.violet};
    cursor: ${props => (props.isLocked ? 'not-allowed' : 'pointer')};
  }

  ${props =>
    props.buttonStyle === 'primary' &&
    css`
      background-color: ${props.theme.violet};
      border: 1px solid ${props.theme.violet};

      &:hover {
        background-color: ${lighten(0.1, props.theme.violet)};
      }
    `}

  ${props =>
    props.buttonStyle === 'contextModal' &&
    css`
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

      @media screen and (max-width: ${props.theme.breakpoints.mobile}) {
        font-size: 1.1rem;
        gap: 1rem;
      }

      svg {
        &:nth-child(3) {
          margin-left: auto;
          transition: transform 0.2s ease-in-out;
        }
      }
    `}

  opacity: ${props => (props.isLocked ? '0.3' : '1')};
  cursor: ${props => (props.isLocked ? 'not-allowed' : 'pointer')};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    max-width: 100%;
  }
`;
export const ActionItem = styled.div<{
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
  
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.1rem;
    gap: 1rem;
  }

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
