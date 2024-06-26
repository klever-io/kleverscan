import { DefaultCardStyles } from '@/styles/common';
import { lighten, transparentize } from 'polished';
import styled, { css } from 'styled-components';

interface IContainer {
  zIndex?: number;
  $error?: boolean;
}

export const ReactSelectStyles = css`
  --select-border-color: ${props => props.theme.black20};

  .react-select {
    margin: 0.25rem 0;
    width: 100%;
  }
  .react-select-empty {
    margin: 0.25rem 0;
    width: 100%;
    .react-select__control {
      border: 1px dashed ${props => props.theme.card.border};
      filter: opacity(0.7);
      &:hover:not(&:focus):not(&:disabled) {
        filter: opacity(1) brightness(1.2);
      }
    }
  }
  .react-select__control--is-focused {
    border: none;
    border-radius: 0.5rem;
    height: 2.5rem;
    width: 100%;
    color: ${props => props.theme.darkText};
  }

  .react-select__control {
    ${DefaultCardStyles}
    border-radius: 0.5rem;
    border: 1px solid var(--select-border-color);
    height: 2.5rem;
    width: 100%;
    padding: 0 0.625rem;
    color: ${props => props.theme.darkText};

    min-height: 3rem;

    transition: 0.2s ease-in-out;
    &:hover {
      border-color: var(--select-border-color);
      box-shadow: 0 0 0.5rem -0.125rem ${props => (props.theme.dark ? lighten(0.2, props.theme.card.background) : lighten(0.6, props.theme.card.background))};
    }
  }
  .react-select__control--is-focused {
    color: ${props => props.theme.darkText};
    border: 1px solid var(--select-border-color);

    box-shadow: 0 0 0.5rem -0.125rem ${props => (props.theme.dark ? lighten(0.2, props.theme.card.background) : lighten(0.6, props.theme.card.background))};
  }
  .react-select__indicator-separator {
    display: none;
  }
  .react-select__dropdown-indicator {
    color: ${props => props.theme.darkText};
    &:hover {
      color: ${props => props.theme.darkText};
    }
  }
  .react-select__value-container {
    padding: 0.125rem;
    height: 2rem;
    width: 100%;
    border-radius: 0.5rem;
    border: none;
    color: ${props => props.theme.darkText};
    caret-color: ${props => props.theme.darkText};
  }
  .react-select__input {
    color: ${props => props.theme.darkText} !important;
  }
  .react-select__menu {
    ${DefaultCardStyles}
    border-radius: 0.5rem;
    border: 1px solid var(--select-border-color);
    color: ${props => props.theme.darkText};
    overflow: overlay;
    padding-left: 4px;
  }
  .react-select__option {
    background-color: unset;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    color: ${props => props.theme.darkText};
    &:hover:not(&:focus):not(&:disabled) {
      border: 1px solid var(--select-border-color);
    }
  }
  .react-select__single-value {
    color: ${props => props.theme.darkText};
  }
  .react-select--is-disabled {
    filter: opacity(0.5) grayscale(0.75) brightness(1.1);
  }
`;

export const Container = styled.div<IContainer>`
  position: relative;

  width: 100%;
  display: flex;
  z-index: ${props => props.zIndex};
  user-select: none;

  flex-direction: column;
  span {
    padding-bottom: 0.25rem;

    color: ${props => props.theme.darkText};
    font-weight: 600;
    font-size: 0.9rem;
  }
  ${ReactSelectStyles}

  ${props =>
    props.$error &&
    css`
      .react-select__control {
        border-color: ${props => props.theme.error};
        background-color: ${props => transparentize(0.9, props.theme.red)};
      }
    `}
`;

export const TitleLabel = styled.label`
  user-select: none;
  font-size: smaller;
  font-weight: 600;
  transform: translate(-1rem, -2.25rem);

  position: absolute;
  left: 1rem;
  top: 0.9rem;

  display: flex;
  align-items: flex-start;

  gap: 0.5rem;

  color: ${({ theme }) => theme.darkText};

  transition: transform 0.2s ease;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    top: 0.8rem;
  }
`;
