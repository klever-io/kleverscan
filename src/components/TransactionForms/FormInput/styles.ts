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
  zIndex?: number;
}

interface ILabel {
  disabled?: boolean;
}

const defaultStyles = css`
  width: 100%;

  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.darkText};
  border-radius: 0.5rem;

  color: ${({ theme }) => theme.darkText};

  background-color: transparent;

  box-shadow: unset;

  font-weight: 500;

  transition: all 0.1s ease-in-out;
`;

export const StyledInput = styled.input<IProps>`
  height: ${({ type }) => (type === 'hidden' ? 0 : 3)}rem;

  color-scheme: ${props => (props.theme.dark ? 'dark' : 'auto')};

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
          background-color: ${transparentize(0.9, theme.red)} !important;
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
          z-index: -2;
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
    appearance: textfield;
    -moz-appearance: textfield;
  }
`;

export const StyledTextArea = styled.textarea<IProps>`
  ${defaultStyles}

  min-width: 100%;
  max-width: 100%;

  min-height: 10rem;

  ${({ theme, error }) =>
    error
      ? css`
          color: ${theme.error} !important;
          border: 1px solid ${theme.error} !important;
          background-color: ${transparentize(0.9, theme.red)} !important;
          + label {
            color: ${theme.error} !important;
          }
        `
      : null}
`;

export const Container = styled.div<IProps>`
  width: 100%;
  position: relative;
  ${props =>
    css`
      grid-column: auto / span ${props.span};
    `}

  > span {
    color: ${props => (props.error ? props.theme.error : props.theme.gray)};

    font-weight: 400;
    font-size: 0.85rem;
  }

  ${props =>
    props.type === 'textarea' &&
    css`
      height: auto;
    `}

  ${props =>
    props.zIndex &&
    css`
      z-index: ${props.zIndex};
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
  color: ${props => props.theme.darkText};
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
  color: ${({ theme }) => theme.darkText};
`;

export const TooltipContent = styled.div`
  &:hover {
    visibility: visible;
  }
  color: ${props => props.theme.form.tooltip};
  position: absolute;
  display: inline-block;
  background-color: ${props => props.theme.form.tooltipContainer};
  padding: 0.4rem 0.5rem 0.4rem 0.5rem;
  margin-left: 1.25rem;
  border-radius: 0.2rem;
  font-size: smaller;
  visibility: hidden;
  width: 100%;
  max-width: fit-content;

  transform: translateY(-25%);

  span {
    font-weight: 300;
  }
`;

export const TooltipContainer = styled.div<{
  tooltip?: string;
}>`
  display: flex;
  user-select: none;
  position: relative;

  width: fit-content;

  > svg {
    align-self: center;
  }

  &:hover {
    width: calc(100% - 1rem);
    div {
      visibility: visible;
    }
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1rem;
  }
`;

export const RequiredSpan = styled.span`
  color: ${props =>
    props.theme.dark ? props.theme.lightBlue : props.theme.lightGray};
`;

export const InputLabel = styled.label<ILabel>`
  user-select: none;
  color: ${({ theme }) => theme.darkText};
  transform: translate(-1rem, -2.25rem);
  z-index: 1;

  width: 100%;

  position: absolute;
  left: 1rem;
  top: 0.9rem;

  display: flex;
  align-items: center;

  gap: 0.5rem;

  transition: transform 0.2s ease;

  > span,
  p {
    opacity: ${props => (props.disabled ? 0.6 : 1)};
    font-size: smaller;
    font-weight: 500;
    color: ${({ theme }) => theme.darkText};
    min-width: fit-content;
  }

  &:hover {
    z-index: 2;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    top: 0.8rem;
  }
`;

export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.error};
  font-size: 0.85rem;
  font-weight: 400;
  position: absolute;
  bottom: -1rem;
  left: 0;
`;