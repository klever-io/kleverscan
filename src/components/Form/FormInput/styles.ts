import { lighten, transparentize } from 'polished';
import { BsQuestionCircleFill } from 'react-icons/bs';
import styled, { css } from 'styled-components';

interface IProps {
  error?: boolean;
  disabled?: boolean;
  valid?: boolean;
  span?: number;
  toggle?: boolean;
  type?: string;
}

interface ILabel {
  disabled?: boolean;
}

const defaultStyles = css`
  width: 100%;

  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.input.border.dark};
  border-radius: 0.5rem;

  color: ${({ theme }) => theme.input.border.dark};

  background-color: transparent;

  box-shadow: unset;

  font-weight: 500;

  transition: all 0.1s ease-in-out;
`;

export const StyledInput = styled.input<IProps>`
  height: ${({ type }) => (type === 'hidden' ? 0 : 3)}rem;

  ${defaultStyles}

  /* Set valid css */
  ${({ theme, valid }) =>
    valid
      ? css`
          border: 1px solid ${theme.status.done} !important;
          + label {
            color: ${theme.status.done} !important;
          }
        `
      : null}

  /* Set error css */
  ${({ theme, error }) =>
    error
      ? css`
          color: ${theme.error} !important;
          border: 1px solid ${theme.error} !important;
          background-color: ${transparentize(0.8, '#9E1313')} !important;
          + label {
            color: ${theme.error} !important;
          }
        `
      : null}

  ${({ type }) =>
    type === 'hidden'
      ? css`
          position: absolute;
          top: 100;
          bottom: 0;
          z-index: -1;
          pointer-events: none;
          color: transparent;
          border: none;
          outline: none;
        `
      : null}

  /* Remove view password icon */
  /* Microsoft Edge */
  &::-ms-reveal {
    display: none;
  }
  /* Safari */
  &::-webkit-contacts-auto-fill-button,
  &::-webkit-credentials-auto-fill-button {
    visibility: hidden;
    display: none !important;
    pointer-events: none;
    height: 0;
    width: 0;
    margin: 0;
  }

  /* Remove number spinners */
  &[type='number']::-webkit-outer-spin-button,
  &[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

export const StyledTextArea = styled.textarea<IProps>`
  ${defaultStyles}

  min-width: 100%;
  max-width: 100%;

  min-height: 20rem;
`;

export const Container = styled.div<IProps>`
  width: 100%;
  position: relative;
  ${props =>
    css`
      grid-column: auto / span ${props.span};
    `}

  span {
    color: ${props => (props.error ? props.theme.error : props.theme.gray)};

    font-weight: 400;
    font-size: 0.85rem;
  }

  ${props =>
    props.type === 'textarea' &&
    css`
      height: auto;
    `}
`;

export const ToggleContainer = styled.div<IProps>`
  display: flex;
  justify-content: flex-start;
  padding: 0.75rem 2rem;
  align-items: center;
  gap: 1rem;
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  color: ${props => props.theme.input.text};
  user-select: none;
`;

export const Slider = styled.div<{ active?: string }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props =>
    props?.active === 'true' ? props.theme.purple : lighten(0, '#7B7DB2')};
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 5rem;
  &:before {
    position: absolute;
    content: '';
    height: 1rem;
    width: 1rem;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

export const Toggle = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 3rem;
  height: 1.5rem;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked + ${Slider}:before {
    -webkit-transform: translateX(1.5rem);
    -ms-transform: translateX(1.5rem);
    transform: translateX(1.5rem);
  }
`;

export const RightContentContainer = styled.div`
  position: absolute;

  top: 50%;
  right: 0;
  transform: translateY(-50%);

  padding: 1rem;

  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const InfoIcon = styled(BsQuestionCircleFill)`
  height: 1rem;
  color: ${({ theme }) => theme.input.border.dark};
`;

export const TooltipContainer = styled.div<{
  tooltip?: string;
}>`
  user-select: none;

  position: relative;
  z-index: 10;

  &:hover {
    &::after {
      font-size: 0.75rem;
      letter-spacing: initial;

      margin-left: 0.5rem;

      background-color: ${props => props.theme.card.background};
      color: ${props => props.theme.white};

      padding: 0.5rem;

      border-radius: 5px;

      z-index: 900;

      white-space: pre;

      transform: translate(-50%, 100%);
      ${props =>
        props.tooltip &&
        css`
          content: '${props.tooltip}';
        `}
    }
  }

  @media screen and (max-width: 1025px) {
    font-size: 1rem;
    max-width: 11ch;
  }
`;

export const InputLabel = styled.label<ILabel>`
  user-select: none;
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  font-size: smaller;
  font-weight: 600;
  transform: translate(-1rem, -2.25rem);

  position: absolute;
  left: 1rem;
  top: 0.9rem;

  display: flex;
  align-items: flex-start;

  gap: 0.5rem;

  color: ${({ theme }) => theme.input.border.dark};

  transition: transform 0.2s ease;

  @media screen and (max-width: 1025px) {
    top: 0.8rem;
  }
`;
